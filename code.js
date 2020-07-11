function getRandomInt(){
    return Math.floor(Math.random()*10);
}
function randomCode()
{
    let code = "";
    for(i=0; i<7; i++){
        code += getRandomInt();
    }
    return code;
}

module.exports = {randomCode:randomCode};