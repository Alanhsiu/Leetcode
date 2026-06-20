import type { AiSolution } from "./aiTypes";
// Added during self-review: Reconstruct Itinerary became correctly uncovered
// after fixing the mislabeled "Coin Challenge" file (which is really Coin Change).
export const D: AiSolution[] = [
  {
    slug: "reconstruct-itinerary",
    summary:
      "Given a list of airline tickets [from, to], reconstruct the single itinerary that uses every ticket exactly once, starting at JFK and, among valid itineraries, choosing the lexicographically smallest.",
    approach: `This is an **Eulerian path** problem. Build an adjacency map from each airport to a sorted multiset of destinations, then run **Hierholzer's algorithm**: repeatedly walk to the smallest available next airport, and when a node has no outgoing tickets left, push it onto the route (post-order). Reversing the post-order gives the itinerary. Using a min-ordered multiset guarantees the lexicographically smallest valid path.`,
    code: `class Solution {
public:
    vector<string> findItinerary(vector<vector<string>>& tickets) {
        unordered_map<string, multiset<string>> adj;
        for (auto& t : tickets) adj[t[0]].insert(t[1]);

        vector<string> route;
        stack<string> st;
        st.push("JFK");
        while (!st.empty()) {
            string u = st.top();
            auto& dests = adj[u];
            if (dests.empty()) {
                route.push_back(u);
                st.pop();
            } else {
                string v = *dests.begin();
                dests.erase(dests.begin());
                st.push(v);
            }
        }
        reverse(route.begin(), route.end());
        return route;
    }
};`,
    timeComplexity: "O(E log E)",
    spaceComplexity: "O(E)",
  },
];
