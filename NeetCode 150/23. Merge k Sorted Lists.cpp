/**
* Definition for singly-linked list.
* struct ListNode {
*     int val;
*     ListNode *next;
*     ListNode() : val(0), next(nullptr) {}
*     ListNode(int x) : val(x), next(nullptr) {}
*     ListNode(int x, ListNode *next) : val(x), next(next) {}
* };
*/
class Solution {
public:
    
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        int listNum=lists.size();
        for(int i=listNum-1; i>=0; i--){
            if(lists[i]==nullptr)
                lists.erase(lists.begin()+i);
        }

        if(lists.empty())
            return nullptr;

        auto comp = [](ListNode* a, ListNode* b){
            return a->val > b->val; // Min-heap logic
        };

        std::priority_queue<ListNode*, vector<ListNode*>, decltype(comp)> pq(comp);
        for(ListNode* head: lists){
            pq.push(head);
        }

        ListNode dummy(0);
        ListNode* cur=&dummy;
        
        while(!pq.empty()){
            ListNode* minNode=pq.top();
            pq.pop();

            cur->next=minNode;
            cur=cur->next;

            if(minNode->next){
                pq.push(minNode->next);
            }
        }

        return dummy.next;
    }
};

// Time Complexity: O(KlogK) for initializing the priority queue, and O(NlogK) for the while loop. So total time complexity is O(NlogK).
// Space Complexity: O(K) for the priority queue.