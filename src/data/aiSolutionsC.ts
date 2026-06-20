import type { AiSolution } from "./aiTypes";
export const C: AiSolution[] = [
  {
    slug: "partition-equal-subset-sum",
    summary: `Decide whether an array of positive integers can be split into two groups whose sums are equal.`,
    approach: `**Key idea:** Two equal halves exist only if the total sum is even and some subset sums to total/2 (a 0/1 subset-sum problem).

Steps:
- Compute the total. If it is odd, return false.
- Let target = total / 2 and use a boolean DP where dp[s] means 's' is reachable as a subset sum.
- For each number, iterate sums downward from target to num so each item is used at most once.
- Return dp[target].`,
    code: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int total = 0;
        for (int x : nums) total += x;
        if (total % 2 != 0) return false;
        int target = total / 2;
        vector<bool> dp(target + 1, false);
        dp[0] = true;
        for (int num : nums) {
            for (int s = target; s >= num; --s) {
                if (dp[s - num]) dp[s] = true;
            }
        }
        return dp[target];
    }
};`,
    timeComplexity: "O(n * target)",
    spaceComplexity: "O(target)",
  },
  {
    slug: "target-sum",
    summary: `Count the number of ways to assign a plus or minus sign to each number so the signed sum equals a given target.`,
    approach: `**Key idea:** If P is the set assigned plus and N the set assigned minus, then sum(P) - sum(N) = target and sum(P) + sum(N) = total, so sum(P) = (total + target) / 2. The answer is the number of subsets summing to that value.

Steps:
- If (total + target) is negative or odd, there are zero ways.
- Let need = (total + target) / 2 and count subsets summing to 'need' with a counting DP.
- For each number, update counts from high sums down to the number.`,
    code: `class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        int total = 0;
        for (int x : nums) total += x;
        long shifted = (long)total + target;
        if (shifted < 0 || shifted % 2 != 0) return 0;
        int need = (int)(shifted / 2);
        vector<int> dp(need + 1, 0);
        dp[0] = 1;
        for (int num : nums) {
            for (int s = need; s >= num; --s) {
                dp[s] += dp[s - num];
            }
        }
        return dp[need];
    }
};`,
    timeComplexity: "O(n * sum)",
    spaceComplexity: "O(sum)",
  },
  {
    slug: "longest-increasing-path-in-a-matrix",
    summary: `Find the length of the longest strictly increasing path in a grid, moving only up, down, left, or right.`,
    approach: `**Key idea:** From each cell the longest increasing path is fixed, so memoize it. Because moves go strictly up in value the dependency graph is acyclic, so DFS with caching is safe.

Steps:
- For each cell run a DFS that explores neighbors with strictly larger values.
- The result for a cell is 1 plus the max over valid neighbors; cache it in a memo grid.
- Track the global maximum over all starting cells.`,
    code: `class Solution {
public:
    int longestIncreasingPath(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        vector<vector<int>> memo(m, vector<int>(n, 0));
        int best = 0;
        for (int i = 0; i < m; ++i)
            for (int j = 0; j < n; ++j)
                best = max(best, dfs(matrix, memo, i, j));
        return best;
    }
private:
    int dfs(vector<vector<int>>& matrix, vector<vector<int>>& memo, int i, int j) {
        if (memo[i][j] != 0) return memo[i][j];
        int m = matrix.size(), n = matrix[0].size();
        int dirs[5] = {0, 1, 0, -1, 0};
        int best = 1;
        for (int d = 0; d < 4; ++d) {
            int ni = i + dirs[d], nj = j + dirs[d + 1];
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
                best = max(best, 1 + dfs(matrix, memo, ni, nj));
            }
        }
        memo[i][j] = best;
        return best;
    }
};`,
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n)",
  },
  {
    slug: "burst-balloons",
    summary: `Given balloons each holding a number, bursting one earns nums[left] * nums[i] * nums[right] (using virtual 1s at the ends); maximize total coins over all burst orders.`,
    approach: `**Key idea:** Think about which balloon is burst LAST within an interval. When balloon k is last in the open interval (left, right), its neighbors are the boundaries left and right, splitting the problem into two independent subintervals.

Steps:
- Pad the array with 1 on both ends.
- Let dp[left][right] be the best coins from bursting all balloons strictly between left and right.
- For every interval, try each k as the last burst: dp[left][k] + nums[left]*nums[k]*nums[right] + dp[k][right].
- Answer is dp[0][n + 1].`,
    code: `class Solution {
public:
    int maxCoins(vector<int>& nums) {
        int n = nums.size();
        vector<int> vals(n + 2);
        vals[0] = vals[n + 1] = 1;
        for (int i = 0; i < n; ++i) vals[i + 1] = nums[i];
        vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
        for (int len = 1; len <= n; ++len) {
            for (int left = 1; left + len - 1 <= n; ++left) {
                int right = left + len - 1;
                for (int k = left; k <= right; ++k) {
                    int coins = vals[left - 1] * vals[k] * vals[right + 1];
                    coins += dp[left][k - 1] + dp[k + 1][right];
                    dp[left][right] = max(dp[left][right], coins);
                }
            }
        }
        return dp[1][n];
    }
};`,
    timeComplexity: "O(n^3)",
    spaceComplexity: "O(n^2)",
  },
  {
    slug: "hand-of-straights",
    summary: `Determine if a hand of cards can be rearranged into groups of consecutive values, each group of a given size.`,
    approach: `**Key idea:** Greedily build groups starting from the smallest available card; each smallest card must begin a run of consecutive values.

Steps:
- If the total count is not divisible by groupSize, return false.
- Count occurrences in an ordered map.
- Repeatedly take the smallest card with positive count and consume groupSize consecutive values starting there, decrementing counts.
- If any required consecutive value is missing, return false.`,
    code: `class Solution {
public:
    bool isNStraightHand(vector<int>& hand, int groupSize) {
        if (hand.size() % groupSize != 0) return false;
        map<int,int> count;
        for (int c : hand) count[c]++;
        while (!count.empty()) {
            int start = count.begin()->first;
            for (int v = start; v < start + groupSize; ++v) {
                auto it = count.find(v);
                if (it == count.end()) return false;
                if (--(it->second) == 0) count.erase(it);
            }
        }
        return true;
    }
};`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
  {
    slug: "merge-triplets-to-form-target-triplet",
    summary: `Given triplets, you may take element-wise maxima of any chosen triplets; decide whether you can produce exactly the target triplet.`,
    approach: `**Key idea:** Only triplets that never exceed the target in any position can contribute, since one over-large value can never be lowered. Among the usable triplets, check that each target coordinate is achievable by some triplet.

Steps:
- Skip any triplet that has a component greater than the corresponding target component.
- For each remaining triplet, mark which positions equal the target value.
- Return true only if all three positions get matched.`,
    code: `class Solution {
public:
    bool mergeTriplets(vector<vector<int>>& triplets, vector<int>& target) {
        bool m0 = false, m1 = false, m2 = false;
        for (auto& t : triplets) {
            if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue;
            if (t[0] == target[0]) m0 = true;
            if (t[1] == target[1]) m1 = true;
            if (t[2] == target[2]) m2 = true;
        }
        return m0 && m1 && m2;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "partition-labels",
    summary: `Split a string into as many parts as possible so that each letter appears in only one part, and return the sizes of those parts.`,
    approach: `**Key idea:** A part must extend at least to the last occurrence of every character it contains. Track the farthest last-occurrence seen and cut when the scan reaches it.

Steps:
- Record the last index of each character.
- Scan left to right, expanding the current part end to the max last-index of seen characters.
- When the current index equals the part end, close the part and record its length.`,
    code: `class Solution {
public:
    vector<int> partitionLabels(string s) {
        vector<int> last(26, 0);
        for (int i = 0; i < (int)s.size(); ++i) last[s[i] - 'a'] = i;
        vector<int> result;
        int start = 0, end = 0;
        for (int i = 0; i < (int)s.size(); ++i) {
            end = max(end, last[s[i] - 'a']);
            if (i == end) {
                result.push_back(end - start + 1);
                start = i + 1;
            }
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "merge-intervals",
    summary: `Combine all overlapping intervals in a list and return the resulting non-overlapping set.`,
    approach: `**Key idea:** After sorting by start, overlapping intervals are adjacent, so a single pass can merge them.

Steps:
- Sort intervals by start time.
- Keep a running merged interval; if the next interval starts at or before its end, extend the end.
- Otherwise push the running interval and start a new one.`,
    code: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> result;
        for (auto& iv : intervals) {
            if (!result.empty() && iv[0] <= result.back()[1]) {
                result.back()[1] = max(result.back()[1], iv[1]);
            } else {
                result.push_back(iv);
            }
        }
        return result;
    }
};`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
  {
    slug: "non-overlapping-intervals",
    summary: `Find the minimum number of intervals to delete so the remaining intervals do not overlap.`,
    approach: `**Key idea:** This is the classic activity-selection problem. Keeping the most non-overlapping intervals (by always choosing the one that ends earliest) minimizes deletions.

Steps:
- Sort intervals by end time.
- Track the end of the last kept interval; if the next interval starts at or after it, keep it and update the end.
- Otherwise it overlaps, so count it as a deletion.`,
    code: `class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {
            return a[1] < b[1];
        });
        int removed = 0;
        long prevEnd = LONG_MIN;
        for (auto& iv : intervals) {
            if (iv[0] >= prevEnd) {
                prevEnd = iv[1];
            } else {
                ++removed;
            }
        }
        return removed;
    }
};`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "minimum-interval-to-include-each-query",
    summary: `For each query value, find the size of the smallest interval that contains it, or -1 if none does.`,
    approach: `**Key idea:** Process queries in increasing order and use a min-heap keyed by interval size. Add intervals as their starts become reachable and lazily drop intervals whose end is already passed.

Steps:
- Sort intervals by start and queries (keeping original indices).
- For each query in ascending order, push all intervals whose start is at most the query as (size, end) into a min-heap.
- Pop intervals whose end is less than the query.
- The heap top, if any, gives the smallest containing interval size.`,
    code: `class Solution {
public:
    vector<int> minInterval(vector<vector<int>>& intervals, vector<int>& queries) {
        sort(intervals.begin(), intervals.end());
        int q = queries.size();
        vector<int> order(q);
        for (int i = 0; i < q; ++i) order[i] = i;
        sort(order.begin(), order.end(), [&](int a, int b) {
            return queries[a] < queries[b];
        });
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> heap;
        vector<int> answer(q, -1);
        int idx = 0, n = intervals.size();
        for (int qi : order) {
            int value = queries[qi];
            while (idx < n && intervals[idx][0] <= value) {
                int size = intervals[idx][1] - intervals[idx][0] + 1;
                heap.push({size, intervals[idx][1]});
                ++idx;
            }
            while (!heap.empty() && heap.top().second < value) heap.pop();
            if (!heap.empty()) answer[qi] = heap.top().first;
        }
        return answer;
    }
};`,
    timeComplexity: "O((n + q) log n)",
    spaceComplexity: "O(n + q)",
  },
  {
    slug: "missing-number",
    summary: `Given an array containing n distinct numbers drawn from 0..n, return the single value in that range that is absent.`,
    approach: `**Key idea:** XOR every index from 0..n together with every array element. Each present value cancels with its index, leaving only the missing number.

Steps:
- Start with result = n (covers the top index since the array has only n elements).
- XOR each index i and each nums[i] into the result.
- The remaining value is the missing number.`,
    code: `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int result = nums.size();
        for (int i = 0; i < (int)nums.size(); ++i) {
            result ^= i ^ nums[i];
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "sum-of-two-integers",
    summary: `Add two integers without using the plus or minus operators, relying only on bitwise operations.`,
    approach: `**Key idea:** XOR adds bits without carrying, while AND shifted left by one produces the carry. Repeat until there is no carry left.

Steps:
- Compute carry = (a AND b) shifted left by 1.
- Compute a = a XOR b (sum ignoring carry).
- Set b = carry and loop until carry is zero.
- Use unsigned arithmetic for the carry shift to avoid signed-overflow undefined behavior.`,
    code: `class Solution {
public:
    int getSum(int a, int b) {
        while (b != 0) {
            unsigned int carry = (unsigned int)(a & b) << 1;
            a = a ^ b;
            b = (int)carry;
        }
        return a;
    }
};`,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
  },
];
