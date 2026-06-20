import type { AiSolution } from "./aiTypes";
// Filled by Phase 4 generation. Each entry is AI-authored and unverified.
export const B: AiSolution[] = [
  {
    slug: "kth-largest-element-in-a-stream",
    summary: `Build a structure that, as numbers are added one at a time, can always report the k-th largest value seen so far.`,
    approach: `**Min-heap of size k.** Keep a min-heap holding only the k largest elements seen so far.

- On each **add**, push the new value, then pop while the heap size exceeds k.
- The heap top is then the k-th largest element, which we return.

This keeps every operation cheap and avoids re-sorting the whole stream.`,
    code: `class KthLargest {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    int k;
public:
    KthLargest(int k, vector<int>& nums) : k(k) {
        for (int x : nums) add(x);
    }

    int add(int val) {
        minHeap.push(val);
        while ((int)minHeap.size() > k) minHeap.pop();
        return minHeap.top();
    }
};`,
    timeComplexity: "O(log k) per add",
    spaceComplexity: "O(k)",
  },
  {
    slug: "k-closest-points-to-origin",
    summary: `Given a set of 2D points, return the k of them that lie closest to the origin (0,0).`,
    approach: `**Max-heap of size k on squared distance.** We never need the actual square root since comparing squared distances preserves order.

- Push each point keyed by x*x + y*y.
- Keep only the k smallest by popping the largest whenever the heap exceeds size k.
- Drain the heap into the result.`,
    code: `class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        priority_queue<pair<int, int>> maxHeap; // (dist, index)
        for (int i = 0; i < (int)points.size(); ++i) {
            int d = points[i][0] * points[i][0] + points[i][1] * points[i][1];
            maxHeap.push({d, i});
            if ((int)maxHeap.size() > k) maxHeap.pop();
        }
        vector<vector<int>> res;
        while (!maxHeap.empty()) {
            res.push_back(points[maxHeap.top().second]);
            maxHeap.pop();
        }
        return res;
    }
};`,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
  },
  {
    slug: "design-twitter",
    summary: `Implement a tiny social feed supporting posting tweets, following/unfollowing users, and fetching the 10 most recent tweets from a user and the people they follow.`,
    approach: `**Per-user tweet lists with a global timestamp, merged by a heap.**

- Each tweet is stored with a monotonically increasing global counter so ordering across users is well defined.
- **getNewsFeed**: gather the latest tweet from the user and each followee into a max-heap keyed by timestamp; repeatedly pop the newest and push that user's previous tweet, up to 10 times.`,
    code: `class Twitter {
    int timer = 0;
    unordered_map<int, vector<pair<int,int>>> tweets;   // user -> (time, tweetId)
    unordered_map<int, unordered_set<int>> following;   // user -> set of followees
public:
    Twitter() {}

    void postTweet(int userId, int tweetId) {
        tweets[userId].push_back({timer++, tweetId});
    }

    vector<int> getNewsFeed(int userId) {
        // max-heap entries: (time, tweetId, ownerId, index-in-owner-list)
        priority_queue<array<int,4>> pq;
        unordered_set<int> users = following[userId];
        users.insert(userId);
        for (int u : users) {
            auto& tw = tweets[u];
            if (!tw.empty()) {
                int idx = tw.size() - 1;
                pq.push({tw[idx].first, tw[idx].second, u, idx});
            }
        }
        vector<int> res;
        while (!pq.empty() && (int)res.size() < 10) {
            auto top = pq.top(); pq.pop();
            res.push_back(top[1]);
            int u = top[2], idx = top[3];
            if (idx > 0) {
                auto& tw = tweets[u];
                pq.push({tw[idx-1].first, tw[idx-1].second, u, idx-1});
            }
        }
        return res;
    }

    void follow(int followerId, int followeeId) {
        if (followerId != followeeId) following[followerId].insert(followeeId);
    }

    void unfollow(int followerId, int followeeId) {
        following[followerId].erase(followeeId);
    }
};`,
    timeComplexity: "O(f + 10 log f) per getNewsFeed, f = followees",
    spaceComplexity: "O(total tweets + follow edges)",
  },
  {
    slug: "find-median-from-data-stream",
    summary: `Support inserting numbers one by one and querying the median of everything inserted so far at any time.`,
    approach: `**Two balanced heaps.** A max-heap holds the smaller half, a min-heap holds the larger half.

- On **addNum**, push into the max-heap, move its top to the min-heap, then rebalance so the max-heap is never smaller than the min-heap.
- The median is the max-heap top when sizes differ, or the average of both tops when equal.`,
    code: `class MedianFinder {
    priority_queue<int> lo;                                   // max-heap, smaller half
    priority_queue<int, vector<int>, greater<int>> hi;       // min-heap, larger half
public:
    MedianFinder() {}

    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top());
        lo.pop();
        if (hi.size() > lo.size()) {
            lo.push(hi.top());
            hi.pop();
        }
    }

    double findMedian() {
        if (lo.size() > hi.size()) return lo.top();
        return (lo.top() + hi.top()) / 2.0;
    }
};`,
    timeComplexity: "O(log n) per add, O(1) per query",
    spaceComplexity: "O(n)",
  },
  {
    slug: "walls-and-gates",
    summary: `In a grid of gates, walls, and empty rooms, fill each empty room with its distance to the nearest gate, leaving rooms unreachable from any gate untouched.`,
    approach: `**Multi-source BFS from all gates at once.**

- Seed a queue with every gate cell (value 0).
- Expand outward in lockstep; the first time a room is reached gives its shortest gate distance.
- Walls (value -1) and already-filled rooms are skipped, so each cell is processed once.`,
    code: `class Solution {
public:
    void wallsAndGates(vector<vector<int>>& rooms) {
        const int INF = 2147483647;
        int m = rooms.size();
        if (m == 0) return;
        int n = rooms[0].size();
        queue<pair<int,int>> q;
        for (int i = 0; i < m; ++i)
            for (int j = 0; j < n; ++j)
                if (rooms[i][j] == 0) q.push({i, j});
        int dirs[5] = {-1, 0, 1, 0, -1};
        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            for (int d = 0; d < 4; ++d) {
                int nr = r + dirs[d], nc = c + dirs[d+1];
                if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
                if (rooms[nr][nc] != INF) continue;
                rooms[nr][nc] = rooms[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
};`,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
  },
  {
    slug: "number-of-connected-components-in-an-undirected-graph",
    summary: `Count how many separate connected groups exist among n labeled nodes given a list of undirected edges.`,
    approach: `**Union-Find (disjoint set union).**

- Start with n singleton components.
- For each edge, union the two endpoints; every successful union (joining two distinct roots) reduces the component count by one.
- Use path compression and union by rank for near-constant amortized operations.`,
    code: `class Solution {
    vector<int> parent, rnk;
    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        parent.resize(n);
        rnk.assign(n, 0);
        for (int i = 0; i < n; ++i) parent[i] = i;
        int count = n;
        for (auto& e : edges) {
            int a = find(e[0]), b = find(e[1]);
            if (a == b) continue;
            if (rnk[a] < rnk[b]) swap(a, b);
            parent[b] = a;
            if (rnk[a] == rnk[b]) rnk[a]++;
            count--;
        }
        return count;
    }
};`,
    timeComplexity: "O((n + e) * alpha(n))",
    spaceComplexity: "O(n)",
  },
  {
    slug: "graph-valid-tree",
    summary: `Decide whether n nodes connected by the given undirected edges form a valid tree: fully connected with no cycles.`,
    approach: `**Union-Find with edge-count check.** A graph on n nodes is a tree exactly when it has n-1 edges and is fully connected (equivalently, acyclic).

- If the number of edges is not n-1, it cannot be a tree.
- Otherwise union every edge; if any edge connects two nodes already in the same set, there is a cycle and it is not a tree.`,
    code: `class Solution {
    vector<int> parent;
    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n - 1) return false;
        parent.resize(n);
        for (int i = 0; i < n; ++i) parent[i] = i;
        for (auto& e : edges) {
            int a = find(e[0]), b = find(e[1]);
            if (a == b) return false; // cycle
            parent[a] = b;
        }
        return true;
    }
};`,
    timeComplexity: "O((n + e) * alpha(n))",
    spaceComplexity: "O(n)",
  },
  {
    slug: "swim-in-rising-water",
    summary: `On a grid where each cell has an elevation and water level rises over time, find the earliest time you can travel from the top-left to the bottom-right, only entering cells whose elevation is at or below the current water level.`,
    approach: `**Dijkstra-style min-heap on the minimax path.** The cost of a path is the maximum elevation along it; we want the path that minimizes this maximum.

- Use a min-heap ordered by the largest elevation seen so far on the path.
- Always expand the lowest-bottleneck cell; the first time we pop the destination, that bottleneck value is the answer.`,
    code: `class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n = grid.size();
        vector<vector<bool>> visited(n, vector<bool>(n, false));
        priority_queue<array<int,3>, vector<array<int,3>>, greater<array<int,3>>> pq;
        pq.push({grid[0][0], 0, 0}); // (time, row, col)
        int dirs[5] = {-1, 0, 1, 0, -1};
        while (!pq.empty()) {
            auto [t, r, c] = pq.top(); pq.pop();
            if (r == n - 1 && c == n - 1) return t;
            if (visited[r][c]) continue;
            visited[r][c] = true;
            for (int d = 0; d < 4; ++d) {
                int nr = r + dirs[d], nc = c + dirs[d+1];
                if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
                if (visited[nr][nc]) continue;
                pq.push({max(t, grid[nr][nc]), nr, nc});
            }
        }
        return -1;
    }
};`,
    timeComplexity: "O(n^2 log n)",
    spaceComplexity: "O(n^2)",
  },
  {
    slug: "cheapest-flights-within-k-stops",
    summary: `Find the cheapest fare from a source city to a destination city using at most k intermediate stops, or report that no such route exists.`,
    approach: `**Bellman-Ford limited to k+1 relaxation rounds.**

- Maintain best-known costs to every city.
- Perform k+1 passes; in each pass relax all edges, but read from a snapshot of the previous pass so each round adds at most one more flight.
- After the passes, the destination's cost is the answer (or -1 if still infinite).`,
    code: `class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        const int INF = 1e9;
        vector<int> cost(n, INF);
        cost[src] = 0;
        for (int i = 0; i <= k; ++i) {
            vector<int> tmp = cost;
            for (auto& f : flights) {
                int u = f[0], v = f[1], w = f[2];
                if (cost[u] == INF) continue;
                tmp[v] = min(tmp[v], cost[u] + w);
            }
            cost = tmp;
        }
        return cost[dst] == INF ? -1 : cost[dst];
    }
};`,
    timeComplexity: "O(k * E)",
    spaceComplexity: "O(n)",
  },
  {
    slug: "min-cost-climbing-stairs",
    summary: `Each stair has a cost to step on; starting from either the first or second stair, find the minimum total cost to climb past the top, moving one or two steps at a time.`,
    approach: `**Bottom-up DP with two rolling variables.** Let the cost to reach the top from a step be its own cost plus the cheaper of the next one or two steps.

- Track only the two previous results since each state depends on the next two.
- Answer is the minimum of starting at step 0 or step 1.`,
    code: `class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {
        int n = cost.size();
        int a = 0, b = 0; // min cost to reach steps i+1 and i+2 (from the top going down)
        for (int i = n - 1; i >= 0; --i) {
            int cur = cost[i] + min(a, b);
            b = a;
            a = cur;
        }
        return min(a, b);
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "coin-change",
    summary: `Given coin denominations and a target amount, return the fewest coins needed to make that amount exactly, or -1 if it is impossible.`,
    approach: `**Unbounded knapsack DP over amounts.**

- dp[a] holds the minimum coins to form amount a, initialized to infinity except dp[0] = 0.
- For each amount, try every coin and take the best dp[a - coin] + 1.
- The final dp[amount] is the answer, with infinity meaning unreachable.`,
    code: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        const int INF = amount + 1;
        vector<int> dp(amount + 1, INF);
        dp[0] = 0;
        for (int a = 1; a <= amount; ++a) {
            for (int c : coins) {
                if (c <= a) dp[a] = min(dp[a], dp[a - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
    timeComplexity: "O(amount * coins)",
    spaceComplexity: "O(amount)",
  },
  {
    slug: "longest-increasing-subsequence",
    summary: `Find the length of the longest strictly increasing subsequence within an array of integers.`,
    approach: `**Patience sorting with binary search.** Maintain a list 'tails' where tails[i] is the smallest possible tail value of an increasing subsequence of length i+1.

- For each number, binary-search for the first tail that is not less than it.
- If found, overwrite it; otherwise append, extending the longest subsequence.
- The length of 'tails' is the answer.`,
    code: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int x : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) tails.push_back(x);
            else *it = x;
        }
        return tails.size();
    }
};`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
];
