class Namespace{
  constructor(id, nsTitle, img, endpoint){
    this.id = id;
    this.img = img;
    this.nsTitle = nsTitle;
    this.endpoint = endpoint;
    this.arrayOfRooms = [];
  }

  addRoom(roomObj){
    this.arrayOfRooms.push(roomObj);
  }

}

module.exports = Namespace;