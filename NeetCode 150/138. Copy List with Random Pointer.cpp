
// Definition for a Node.
class Node {
public:
    int val;
    Node* next;
    Node* random;
    
    Node(int _val) {
        val = _val;
        next = NULL;
        random = NULL;
    }
};


class Solution {
public:
    Node* copyRandomList(Node* head) {
        if(!head){
            return nullptr;
        }

        // old1, old2, ...
        // old1, new1, old2, new2, ...
        
        // copy next
        Node* cur=head;
        while(cur){
            Node* newNode=new Node(cur->val);
            newNode->next=cur->next;
            cur->next=newNode;
            cur=newNode->next;
        }

        // copy random
        cur=head;
        while(cur){
            if(cur->random){
                cur->next->random=cur->random->next;
            }
            cur=cur->next->next;
        }

        // separate the new list
        Node dummy=Node(0);
        Node* ccur=&dummy;

        cur=head;
        while(cur){
            ccur->next=cur->next;
            ccur=ccur->next;

            cur->next=cur->next->next;
            cur=cur->next;
        }

        return dummy.next;
        
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1), since we use interleaving nodes to avoid using extra space for a hash map.