class DetectSquares {
public:
    vector<vector<int>> cnts;
    unordered_map<int, vector<int>> x_to_y;
    DetectSquares():cnts(1001, vector<int>(1001, 0)) {}
    
    void add(vector<int> point) {
        if(cnts[point[0]][point[1]]++ ==0){
            x_to_y[point[0]].push_back(point[1]);
        }
    }
    
    int count(vector<int> point) {
        int x=point[0];
        int y=point[1];
        int res=0;

        auto it=x_to_y.find(x);
        if(it==x_to_y.end()){
            return 0;
        }
        
        for(const int& y2: it->second){
            if(y2==y){
                continue;
            }
            int d=std::abs(y2-y);
            if(x-d>=0){
                res+=cnts[x][y2]*cnts[x-d][y]*cnts[x-d][y2];
            }
            if(x+d<=1000){
                res+=cnts[x][y2]*cnts[x+d][y]*cnts[x+d][y2];
            }
        }

        return res;
    }
};

// Time Complexity: O(1) for add, O(N) for count
// Space Complexity: O(N) for cnts, O(N) for x_to_y