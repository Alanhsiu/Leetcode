class ParkingSystem {
private:
    int parkingSpace[3];
public:
    ParkingSystem(int big, int medium, int small) {
        parkingSpace[0]=big;
        parkingSpace[1]=medium;
        parkingSpace[2]=small;
    }
    
    bool addCar(int carType) {
        if(parkingSpace[carType-1]>0){
            --parkingSpace[carType-1];
            return true;
        }

        return false;
    }
};

/**
 * Your ParkingSystem object will be instantiated and called as such:
 * ParkingSystem* obj = new ParkingSystem(big, medium, small);
 * bool param_1 = obj->addCar(carType);
 */

 // Time Complexity: O(1)
 // Space Complexity: O(1)