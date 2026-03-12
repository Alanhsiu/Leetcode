#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Shape {
protected:
    string name;
    static int count; // Static member

public:
    Shape(string n) : name(n) { count++; }
    
    // Virtual Destructor (Critical for polymorphism)
    virtual ~Shape() {} 

    // Pure Virtual Function (Abstract Class)
    virtual double area() const = 0; 

    static int getCount() { return count; }
};

int Shape::count = 0; // Initialize static member

class Circle : public Shape {
    double r;
public:
    Circle(double radius) : Shape("Circle"), r(radius) {}

    // Override & Const Correctness
    double area() const override { return 3.14 * r * r; }

    // Operator Overloading
    bool operator>(const Circle& other) const {
        return this->area() > other.area();
    }
};

class Rect : public Shape {
    double w, h;
public:
    Rect(double w, double h) : Shape("Rect"), w(w), h(h) {}
    double area() const override { return w * h; }
};

int main() {
    // Polymorphism: Base pointer -> Derived objects
    vector<Shape*> shapes;
    shapes.push_back(new Circle(5));
    shapes.push_back(new Rect(4, 5));

    cout << "Total: " << Shape::getCount() << endl;

    for (Shape* s : shapes) {
        cout << s->area() << endl; // Dynamic Binding
    }

    // Operator Overloading Test
    Circle c1(5), c2(2);
    if (c1 > c2) cout << "c1 is bigger";

    // Manual Cleanup
    for (Shape* s : shapes) delete s; 
    
    return 0;
}