#include <functional>
#include <mutex>
#include <condition_variable>
using namespace std;

class Foo {
private:
    int count=1;
    std::mutex mtx;
    std::condition_variable cv;

public:
    Foo() {
    }

    void first(function<void()> printFirst) {
        std::unique_lock<std::mutex> lock(mtx);
        // printFirst() outputs "first". Do not change or remove this line.
        printFirst();
        count=2;
        cv.notify_all();
    }

    void second(function<void()> printSecond) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [this]{return count==2;});

        // printSecond() outputs "second". Do not change or remove this line.
        printSecond();

        count=3;
        cv.notify_all();
    }

    void third(function<void()> printThird) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [this]{return count==3;});
        
        // printThird() outputs "third". Do not change or remove this line.
        printThird();
    }
};