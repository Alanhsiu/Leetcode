import type { AiSolution } from "./aiTypes";
export const A: AiSolution[] = [
  {
    slug: "valid-anagram",
    summary: `Decide whether two strings are anagrams of each other, meaning one is a rearrangement of the other's characters with identical counts.`,
    approach: `Count the frequency of each character in the first string, then decrement those counts while scanning the second string.

- If the lengths differ, they cannot be anagrams.
- Use a 26-slot array (lowercase letters) as a counter.
- After processing both strings, every count must be zero.`,
    code: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        int count[26] = {0};
        for (char c : s) count[c - 'a']++;
        for (char c : t) {
            if (--count[c - 'a'] < 0) return false;
        }
        return true;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "top-k-frequent-elements",
    summary: `Given an array of integers, return the k values that appear most often.`,
    approach: `Tally how many times each value occurs, then use bucket sort by frequency so we avoid a full sort.

- Build a hash map from value to its count.
- Create buckets indexed by frequency (0..n); place each value in the bucket matching its count.
- Walk the buckets from highest frequency downward, collecting values until we have k of them.`,
    code: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int,int> freq;
        for (int x : nums) freq[x]++;
        int n = nums.size();
        vector<vector<int>> buckets(n + 1);
        for (auto& [val, cnt] : freq) buckets[cnt].push_back(val);
        vector<int> result;
        for (int f = n; f >= 1 && (int)result.size() < k; --f) {
            for (int val : buckets[f]) {
                result.push_back(val);
                if ((int)result.size() == k) break;
            }
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    slug: "encode-and-decode-strings",
    summary: `Implement a pair of routines that serialize a list of strings into a single string and later reconstruct the original list, handling any characters including separators.`,
    approach: `Use length-prefix encoding so arbitrary characters (including delimiters) are safe.

- For each string, write its length, a delimiter such as '#', then the raw string.
- To decode, read digits up to the '#' to learn the length, then slice exactly that many characters.`,
    code: `class Codec {
public:
    string encode(vector<string>& strs) {
        string result;
        for (const string& s : strs) {
            result += to_string(s.size());
            result += '#';
            result += s;
        }
        return result;
    }

    vector<string> decode(string& s) {
        vector<string> result;
        int i = 0, n = s.size();
        while (i < n) {
            int j = i;
            while (s[j] != '#') j++;
            int len = stoi(s.substr(i, j - i));
            result.push_back(s.substr(j + 1, len));
            i = j + 1 + len;
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    slug: "product-of-array-except-self",
    summary: `Produce an array where each position holds the product of every other element, without using division.`,
    approach: `Combine a prefix-product pass with a suffix-product pass.

- First sweep left to right, storing the product of all elements before each index.
- Then sweep right to left, multiplying in the running product of all elements after each index.
- The output array doubles as the prefix storage, so only O(1) extra space beyond the result is used.`,
    code: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, 1);
        for (int i = 1; i < n; ++i) {
            result[i] = result[i - 1] * nums[i - 1];
        }
        int suffix = 1;
        for (int i = n - 1; i >= 0; --i) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "longest-repeating-character-replacement",
    summary: `Find the longest substring you can make consist of one repeated character, given at most k allowed replacements of other characters.`,
    approach: `Slide a window while tracking the count of the most frequent character inside it.

- Expand the right edge and update letter counts plus the running max count.
- The window is valid when (window size minus max count) is at most k; otherwise shrink from the left.
- The answer is the largest valid window seen.`,
    code: `class Solution {
public:
    int characterReplacement(string s, int k) {
        int count[26] = {0};
        int left = 0, maxCount = 0, best = 0;
        for (int right = 0; right < (int)s.size(); ++right) {
            maxCount = max(maxCount, ++count[s[right] - 'A']);
            while ((right - left + 1) - maxCount > k) {
                count[s[left] - 'A']--;
                left++;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "sliding-window-maximum",
    summary: `For every contiguous window of size k sliding across an array, report the maximum value in that window.`,
    approach: `Maintain a deque of indices whose values are in decreasing order (a monotonic deque).

- Before adding a new index, pop smaller values from the back since they can never be a future maximum.
- Pop the front when it falls outside the current window.
- The front of the deque is always the maximum of the current window once we reach full window size.`,
    code: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> result;
        for (int i = 0; i < (int)nums.size(); ++i) {
            while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
            dq.push_back(i);
            if (dq.front() <= i - k) dq.pop_front();
            if (i >= k - 1) result.push_back(nums[dq.front()]);
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
  },
  {
    slug: "car-fleet",
    summary: `Cars head toward a shared destination at fixed speeds; a faster car catching a slower one forms a fleet moving at the slower speed. Count how many distinct fleets reach the target.`,
    approach: `Sort cars by starting position descending (closest to the target first) and compare arrival times.

- For each car compute the time to reach the target as (target minus position) divided by speed.
- Scan from the car nearest the destination; a car forms a new fleet only if its arrival time is strictly greater than the current fleet leader's time.
- Otherwise it catches up and merges into the existing fleet.`,
    code: `class Solution {
public:
    int carFleet(int target, vector<int>& position, vector<int>& speed) {
        int n = position.size();
        vector<pair<int,double>> cars(n);
        for (int i = 0; i < n; ++i) {
            cars[i] = {position[i], (double)(target - position[i]) / speed[i]};
        }
        sort(cars.begin(), cars.end(), [](const auto& a, const auto& b) {
            return a.first > b.first;
        });
        int fleets = 0;
        double lead = 0.0;
        for (auto& [pos, time] : cars) {
            if (time > lead) {
                fleets++;
                lead = time;
            }
        }
        return fleets;
    }
};`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
  {
    slug: "binary-search",
    summary: `Locate a target value inside a sorted array and return its index, or -1 if it is absent.`,
    approach: `Classic binary search over the index range.

- Keep low and high pointers and inspect the midpoint each step.
- Move the appropriate pointer depending on whether the midpoint value is too small or too large.
- Use low plus half the gap to compute mid and avoid overflow.`,
    code: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int lo = 0, hi = nums.size() - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
};`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "koko-eating-bananas",
    summary: `Koko must finish all banana piles within a given number of hours; each hour she eats up to a chosen rate from a single pile. Find the smallest eating rate that lets her finish in time.`,
    approach: `Binary search on the answer (the eating speed).

- The feasible speeds range from 1 to the largest pile.
- For a candidate speed, the hours needed is the sum over piles of ceil(pile / speed).
- Search for the smallest speed whose required hours do not exceed the limit.`,
    code: `class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int lo = 1, hi = *max_element(piles.begin(), piles.end());
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            long long hours = 0;
            for (int p : piles) hours += (p + mid - 1) / mid;
            if (hours <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};`,
    timeComplexity: "O(n log m)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "time-based-key-value-store",
    summary: `Build a store that records values for keys at specific timestamps and can fetch, for a query timestamp, the value set at the largest timestamp not exceeding it.`,
    approach: `Keep, per key, a list of (timestamp, value) pairs appended in increasing timestamp order.

- Because set calls arrive with non-decreasing timestamps, each key's list stays sorted.
- For get, binary search the list for the rightmost entry whose timestamp is at most the query.
- Return that value, or an empty string if none qualifies.`,
    code: `class TimeMap {
    unordered_map<string, vector<pair<int,string>>> store;
public:
    TimeMap() {}

    void set(string key, string value, int timestamp) {
        store[key].push_back({timestamp, value});
    }

    string get(string key, int timestamp) {
        auto it = store.find(key);
        if (it == store.end()) return "";
        auto& vec = it->second;
        int lo = 0, hi = vec.size() - 1;
        string result = "";
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (vec[mid].first <= timestamp) {
                result = vec[mid].second;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return result;
    }
};`,
    timeComplexity: "O(log n) per get, O(1) per set",
    spaceComplexity: "O(n)",
  },
  {
    slug: "find-the-duplicate-number",
    summary: `An array of n+1 integers holds values in the range 1..n, so at least one value repeats. Identify the duplicate without modifying the array and using constant extra space.`,
    approach: `Treat the array as a linked list where each value points to the index it names, then apply Floyd's cycle detection.

- The duplicate value creates a cycle in this implicit list.
- Phase one: advance a slow pointer one step and a fast pointer two steps until they meet.
- Phase two: reset one pointer to the start and move both one step at a time; their meeting point is the duplicate.`,
    code: `class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    slug: "serialize-and-deserialize-binary-tree",
    summary: `Convert a binary tree into a string and reconstruct an identical tree from that string, supporting any structure including empty subtrees.`,
    approach: `Use a preorder traversal that emits a marker for null children.

- Serialize: write each node's value followed by recursive calls on left and right; emit a sentinel such as 'N' for a missing node, separating tokens with spaces.
- Deserialize: read tokens in the same preorder sequence; a sentinel produces a null node, otherwise build a node and recursively construct its left then right subtrees.`,
    code: `class Codec {
public:
    string serialize(TreeNode* root) {
        string result;
        function<void(TreeNode*)> dfs = [&](TreeNode* node) {
            if (!node) {
                result += "N ";
                return;
            }
            result += to_string(node->val) + " ";
            dfs(node->left);
            dfs(node->right);
        };
        dfs(root);
        return result;
    }

    TreeNode* deserialize(string data) {
        istringstream in(data);
        function<TreeNode*()> build = [&]() -> TreeNode* {
            string token;
            in >> token;
            if (token == "N") return nullptr;
            TreeNode* node = new TreeNode(stoi(token));
            node->left = build();
            node->right = build();
            return node;
        };
        return build();
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
];
