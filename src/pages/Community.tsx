import { useState } from 'react'
import { useStore } from '../store/useStore'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const platformLabel: Record<string, string> = {
  codeforces: 'Codeforces',
  atcoder: 'AtCoder',
  leetcode: 'LeetCode',
}

export default function Community() {
  const profile = useStore((s) => s.profile)
  const peers = useStore((s) => s.peers)
  const posts = useStore((s) => s.posts)
  const addPost = useStore((s) => s.addPost)
  const addComment = useStore((s) => s.addComment)
  const toggleLike = useStore((s) => s.toggleLike)
  const [composer, setComposer] = useState('')
  const [comments, setComments] = useState<Record<string, string>>({})

  const submitPost = () => {
    if (!composer.trim()) return
    addPost(composer)
    setComposer('')
  }

  const submitComment = (postId: string) => {
    const text = comments[postId] ?? ''
    if (!text.trim()) return
    addComment(postId, text)
    setComments((prev) => ({ ...prev, [postId]: '' }))
  }

  const displayPeers = peers.map((p) =>
    p.isMe
      ? {
          ...p,
          name: profile.name,
          handle: profile.cf_handle || p.handle,
          rating: profile.current_rating,
        }
      : p,
  )
  const me = displayPeers.find((p) => p.isMe)
  const sorted = [...displayPeers].sort((a, b) => b.rating - a.rating)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Share progress, comment on friends' posts and compare your stats.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <textarea
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              rows={3}
              placeholder="Share a milestone, ask for help, or post your contest result..."
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">{composer.length}/280</span>
              <button
                onClick={submitPost}
                disabled={!composer.trim()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>

          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
                  {post.author.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{post.author}</div>
                  <div className="text-xs text-slate-500">
                    @{post.handle} · {timeAgo(post.created_at)}
                  </div>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{post.content}</p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.likedByMe ? 'text-rose-600' : 'text-slate-500 hover:text-rose-500'
                  }`}
                >
                  {post.likedByMe ? '❤️' : '🤍'} {post.likes}
                </button>
                <span className="text-slate-500">💬 {post.comments.length}</span>
              </div>

              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                {post.comments.map((c) => (
                  <div key={c.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60">
                    <span className="font-semibold">{c.author}</span>{' '}
                    <span className="text-slate-600 dark:text-slate-300">{c.content}</span>
                    <div className="text-[10px] text-slate-400">{timeAgo(c.created_at)}</div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={comments[post.id] ?? ''}
                    onChange={(e) => setComments((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                  <button
                    onClick={() => submitComment(post.id)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold">Peer comparison</h2>
            <p className="mt-0.5 text-xs text-slate-500">You vs. friends on the same journey</p>
            <div className="mt-3 space-y-2">
              {sorted.map((peer, i) => (
                <div
                  key={peer.handle}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                    peer.isMe
                      ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/30'
                      : 'border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-xs font-bold text-slate-400">{i + 1}</span>
                    <div>
                      <div className="text-sm font-medium">
                        {peer.name} {peer.isMe && <span className="text-xs text-indigo-600">(you)</span>}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        @{peer.handle} · {platformLabel[peer.platform]}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{peer.rating}</div>
                    <div className="text-[10px] text-slate-500">🔥 {peer.streak}d</div>
                  </div>
                </div>
              ))}
            </div>
            {me && (
              <p className="mt-3 text-xs text-slate-500">
                You're <span className="font-semibold text-slate-700 dark:text-slate-300">{sorted[0].rating - me.rating}</span>{' '}
                rating behind the leader. Closing that gap is a great next milestone.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold">Community stats</h2>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Members</span>
                <span className="font-semibold">1,284</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Posts today</span>
                <span className="font-semibold">37</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Problems solved today</span>
                <span className="font-semibold">612</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active streaks</span>
                <span className="font-semibold">204</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
