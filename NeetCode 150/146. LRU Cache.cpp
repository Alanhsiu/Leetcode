struct Node {
int key;
int val;
Node* next;
Node* prev;
Node(int _key, int _val): key(_key), val(_val), next(nullptr), prev(nullptr){}
};

class LRUCache {
private:
unordered_map<int, Node*> umap;
Node* head;
Node* tail;
int cap;

void remove(Node *curNode){
    curNode->prev->next=curNode->next;
    curNode->next->prev=curNode->prev;
}

void add(Node *curNode){
    Node* prev=tail->prev;
    prev->next=curNode;
    tail->prev=curNode;
    curNode->prev=prev;
    curNode->next=tail;
}

public:
LRUCache(int capacity) {
    head=new Node(-1, -1);
    tail=new Node(-1, -1);
    head->next=tail;
    tail->prev=head;
    cap=capacity;
}

~LRUCache(){
    Node* curNode=head;
    while(curNode){
        Node* next=curNode->next;
        delete curNode;
        curNode=next;
    }
}

int get(int key) {
    auto it=umap.find(key);
    if(it!=umap.end()){
        Node* curNode=it->second;
        remove(curNode);
        add(curNode);
        return curNode->val;
    }
    return -1;
}

void put(int key, int value) {
    Node* curNode;
    auto it=umap.find(key);
    if(it!=umap.end()){
        curNode=it->second;
        curNode->val=value;

        remove(curNode);
    }
    else{
        curNode=new Node(key, value);
        umap[key]=curNode;
    }
    add(curNode);
    
    
    if(umap.size()>cap){
        Node* targetNode=head->next;
        remove(targetNode);
        umap.erase(targetNode->key);
        delete targetNode;
    }
}
};

/**
* Your LRUCache object will be instantiated and called as such:
* LRUCache* obj = new LRUCache(capacity);
* int param_1 = obj->get(key);
* obj->put(key,value);
*/

// Time Complexity: O(1) for get and put
// Space Complexity: O(N) for the cache, N is the capacity of the cache