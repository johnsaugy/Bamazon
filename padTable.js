function padText(titleText, entryText){
  
  var padLeft;
  var padRight;

  // Subtract text lengths
  var splitLength = (titleText.length - entryText.length)/2;

  // Loop through length difference to get proper padding
  var pad = '';
  for(var j=0; j < splitLength; j++){
    pad += ' ';
  }

  //odd sized lengths
  if(Number.isInteger(splitLength)){
    padLeft = pad;
    padRight = pad;
  }
  else{
    padLeft = pad;
    padRight = pad.substring(0, pad.length-1);
  }



  // Return newly padded entry for table
  return padLeft + entryText + padRight;
}

// Export to other Bamazon scripts
module.exports = padText;