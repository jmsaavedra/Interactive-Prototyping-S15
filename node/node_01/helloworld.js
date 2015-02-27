
//in your Terminal, navigate to this folder, then type:
//node helloworld.js
//then hit enter
console.log("Node application Running - Press CTRL-C to Quit");

var count = 0;

function hello(){

	console.log("hello! Current Count is: "+count);

	count++;
}

setInterval(hello, 1500);