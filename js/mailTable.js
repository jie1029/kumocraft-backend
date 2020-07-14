var mailTable = new Map();

function deleteCodeTable(mail)
{
    if(mailTable.get(mail) != undefined) mailTable.delete(mail);
}

function getTable(mail)
{
    return mailTable.get(mail);
}

function setTable(mail,code)
{
    return mailTable.set(mail,code);
}

module.exports = {
    delete:deleteCodeTable,
    get:getTable,
    set:setTable
}