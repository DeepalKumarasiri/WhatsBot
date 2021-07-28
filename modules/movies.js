// Coded my iruPC.net
const axios = require('axios');

const config = require('../config');
const { MongoClient } = require('mongodb');

async function mainF(keyword) {
  
  const uri = config.movie_db_url;
  const client = await new MongoClient(uri, {useUnifiedTopology: true});

  try {
    await client.connect();
    
    const mydb = client.db("Cluster0").collection("-1001425546590");
    
    var key_word = keyword;
    const replyText = await search_Movie(mydb, key_word);
    
    return replyText;

  } finally {
    await client.close();
  }
}

async function getFileId(input){
  if (input.indexOf("t.me/IruPC/")>-1){
    return input;
  }
  else {
    var number = input.split("/").length;
    return input.split("/")[number-1];
  }
}

async function search_Movie(mydb,searchWord) {
  
  const projection = { _id: 0, file_name: 1, file_size: 1, link: 1};

  var searchWord = await searchWord.replace(":", " ").replace("-", " ").replace("  ", " ").replace("  ", " ");
  
  const searchArray = await searchWord.split(" ");
  
  const query = await findQuesy(searchWord.split(" "));

  const cursor = await mydb.find(query).project(projection);
  
  const allValues = await cursor.toArray();
  
  var outPut = "";
  for (let i = 0; i < allValues.length; i++) {
    if (allValues[i].file_size == "👍 "){
      var fileSize = "";
    } else{
      var fileSize = Math.round(allValues[i].file_size/1048576)+"MB";
    }
    var fileid = await getFileId(allValues[i].link);
    if (fileid.indexOf("IruPC")>-1){
      var tempLink = fileid; 
    } else{
      var tempoLink = `https://www.irupc.net/p/bot.html?${fileid}?${allValues[i].file_name.split(' ').join('.')}?size?${fileSize}`; 
      var tempLink = await getShortURL(tempoLink);
      var tempLink = tempLink.short;
    }

    outPut = outPut +`
*[${fileSize}] ${allValues[i].file_name}*
📌 ${tempLink}
`;
    var fileid = "";
    var tempLink = "";
    var fileSize = "";
    outPut = outPut.replace("[NaNMB] ", "");
  }
  return outPut;
}

async function findQuesy(searchArray){
  if (searchArray.length>=6){
    var query = "";
  } else if (searchArray.length==1){
    var query = { 
      $text: { 
        $search: `\"${searchArray[0]}\"` 
      }
    }
  } else if (searchArray.length==2){
    var query = { 
      $text: { 
        $search: `\"${searchArray[0]}\" \"${searchArray[1]}\"` 
      }
    }
  } else if (searchArray.length==3){
    var query = { 
      $text: { 
        $search: `\"${searchArray[0]}\" \"${searchArray[1]}\" \"${searchArray[2]}\"` 
      }
    }
  } else if (searchArray.length==4){
    var query = { 
      $text: { 
        $search: `\"${searchArray[0]}\" \"${searchArray[1]}\" \"${searchArray[2]}\" \"${searchArray[3]}\"` 
      }
    }
  } else if (searchArray.length==5){
    var query = { 
      $text: { 
        $search: `\"${searchArray[0]}\" \"${searchArray[1]}\" \"${searchArray[2]}\" \"${searchArray[3]}\" \"${searchArray[4]}\"` 
      }
    }
  } else{var query ="";}
  return query;
}

async function getShortURL(input) {
    var mainconfig = {
        method: 'get',
        url: `https://da.gd/s?url=${input}` 
    }
    return axios(mainconfig)
        .then(async function (response) {
            var shortened = response.data
            var out = ({
                input: input,
                short: shortened.replace(/\n/g, '').replace("da.gd", "click.irupc.xyz")
            })
            return out
        })
        .catch(function (error) {
            return "error"
        })
}
