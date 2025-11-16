```cpp
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indegree(numCourses, 0);

        for(vector<int> p: prerequisites){
            int course=p[0];
            int pre_course=p[1];

            adj[pre_course].push_back(course);
            ++indegree[course];
        }

        std::queue<int> q;
        int finished=0;

        for(int i=0; i<numCourses; ++i){
            if(indegree[i]==0){
                q.push(i);
            }
        }

        while(!q.empty()){
            int cur=q.front();
            q.pop();

            ++finished;

            for(int v: adj[cur]){
                --indegree[v];

                if(indegree[v]==0)
                    q.push(v);
            }
        }

        return finished==numCourses;

    }
};

// Time: O(V+E)
// Space: O(V+E)
```