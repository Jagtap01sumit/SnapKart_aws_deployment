let object={
    name:"username",
    myfunction:function(){
        console.log(this.name);
    }
}
object.myfunction();

let fun=function sectond(){
    let name="sumit";
    console.log(this.name);
}

let myname=()=>{
    let name="sumit";
    console.log(this.name);

}
console.log("ehll");    