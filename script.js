const userInput = document.getElementById("userInput");
const btnConvert = document.getElementById("btnConvert");
const convertedDisItem = document.getElementsByClassName("convertedDisItem");
const convertedDisplay = document.getElementById("convertedDisplay");

const romanValues = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
}

const acceptedSigns = ["M", "D", "C", "L", "X", "V", "I"];
const acceptedNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const notConvertable = "Not convertable! Please check if your input follows the Rules of Roman Numerals.";

btnConvert.addEventListener("click", () => {
    if(userInput.value !== ""){
        init();
        if(acceptedSigns.includes(userInput.value[0].toUpperCase())){
            convertRomanToDecimal();
        } else if(acceptedNumbers.includes(userInput.value[0])){
            convertDecimalToRoman();
        } else{
            convertedDisplay.textContent = notConvertable;
            for(let item of convertedDisItem){
                item.style.display = "none";
            }
        }
    }
    
    
    
    
})

function convertRomanToDecimal(){
    userInput.value = userInput.value.toUpperCase().trim();
    let total = 0;
    let accepted = true;
    for(let input of userInput.value){
        // if any unallowed signs are entered or the roman numerals are not in the right order, show error + stop calculation
        if(!acceptedSigns.includes(input.toUpperCase()) || !rightOrder()){
            convertedDisplay.textContent = notConvertable;
            accepted = false;
        }
    }
    if(accepted){
        // Display how many of each roman numerals are enterd and their values
        // and calculate their total
        for(let i = 0; i < acceptedSigns.length; i++){
            let letterFreq = charCount(userInput.value, acceptedSigns[i]);
            // check if any sign is entered at least 4 times in a row
            let fourTimes = `${acceptedSigns[i]}${acceptedSigns[i]}${acceptedSigns[i]}${acceptedSigns[i]}`
            if(userInput.value.includes(fourTimes)){
                convertedDisplay.textContent = notConvertable;
                i = acceptedSigns.length;
            }
            // display each roman numeral with it's decimal value
            convertedDisItem[i].textContent = `${acceptedSigns[i]}(${letterFreq / romanValues[acceptedSigns[i]]}x) = ${letterFreq}`;
            total += charCount(userInput.value, acceptedSigns[i]);
        }
        // Display IV, IX,...
        displaySpecialEnd();
        // display total
        convertedDisplay.textContent = `Total : ${total}`;
    }

    // check if roman signs are in the right order
    function rightOrder(){
        // create Array with the used roman signs
        const usedRoman = acceptedSigns.filter(letter => {
            return userInput.value.includes(letter);
        });
        let startI = 1;
        let loopEnd = usedRoman.length;
        // if input contains "IV" or "IX" don't check if "V" or "X" is after "I"
        if(specialEnd()){
            loopEnd = usedRoman.length - 2;
        }
        // check for each sign if it's last index is higher than that any of the lowervalued signs 
        for(let i = 0; i < loopEnd; i++){
            let lastIndex = userInput.value.lastIndexOf(usedRoman[i]);
            for(let i = startI; i < usedRoman.length; i++){
                let currentIndex = userInput.value.lastIndexOf(usedRoman[i]);
                // if one of the special combinations is included dont' check if any "M" comes after "C" or "D" after "C" etc.
                if(userInput.value.includes("CM") && usedRoman[i] === "C"){
                    currentIndex = lastIndex;
                    if(userInput.value.lastIndexOf("M") !== userInput.value.indexOf("C") + 1){
                        return false;
                    }
                } else if(userInput.value.includes("CD") && usedRoman[i] === "C"){
                    currentIndex = lastIndex;
                    if(userInput.value.lastIndexOf("D") !== userInput.value.indexOf("C") + 1){
                        return false;
                    }
                } else if(userInput.value.includes("XC") && usedRoman[i] === "X"){
                    currentIndex = lastIndex;
                    if(userInput.value.lastIndexOf("C") !== userInput.value.indexOf("X") + 1){
                        return false;
                    }
                } else if(userInput.value.includes("XL") && usedRoman[i] === "X"){
                    currentIndex = lastIndex;
                    if(userInput.value.lastIndexOf("L") !== userInput.value.indexOf("X") + 1){
                        return false;
                    }
                }
                if(lastIndex > currentIndex){
                    return false;
                }
            }
            // start searching at the next lower valued sign
            startI++;
        }
            return true;
    }  
    
    function specialEnd(){
        if(userInput.value.includes("IV") || userInput.value.includes("IX")){
            return true;
        }
    }

    function displaySpecialEnd(){
        // change output for IV at the end
        if(userInput.value.includes("IV")){
            total -= 2;
            convertedDisItem[5].textContent = "V(0x) = 0";
            convertedDisItem[6].textContent = "IV(1x) = 4";
        // change output for IX at the end
        }
        if(userInput.value.includes("IX")){
            total -= 2;
            convertedDisItem[4].textContent = "X(0x) = 0";
            convertedDisItem[6].textContent = "IX(1x) = 9";
        }
        // change output for XL at the end
        if(userInput.value.includes("XL")){
            total -= 20;
            convertedDisItem[3].textContent = "L(0x) = 0";
            convertedDisItem[4].textContent = "XL(1x) = 40";
        }
        // change output for XC at the end
        if(userInput.value.includes("XC")){
            total -= 20;
            convertedDisItem[2].textContent = "C(0x) = 0";
            convertedDisItem[4].textContent = "XC(1x) = 90";
        }
        // change output for CD at the end
        if(userInput.value.includes("CD")){
            total -= 200;
            convertedDisItem[1].textContent = "D(0x) = 0";
            convertedDisItem[2].textContent = "CD(1x) = 400";
        }
        // change output for CM at the end
        if(userInput.value.includes("CM")){
            total -= 200;
            convertedDisItem[0].textContent = `M(${(charCount(userInput.value, "M") - 1000) / 1000}x) = ${charCount(userInput.value, "M") - 1000}`;
            convertedDisItem[2].textContent = "CM(1x) = 900";
        }
    }
}

const digits4 = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    0: "no I"
}

const digits3 = {
    1: "X",
    2: "XX",
    3: "XXX",
    4: "XL",
    5: "L",
    6: "LX",
    7: "LXX",
    8: "LXXX",
    9: "XC",
    0: "no X or L"
}

const digits2 = {
    1: "C",
    2: "CC",
    3: "CCC",
    4: "CD",
    5: "D",
    6: "DC",
    7: "DCC",
    8: "DCCC",
    9: "CM",
    0: "no C or D"
}

const digits1 = {
    1: "M",
    2: "MM",
    3: "MMM",
    0: "no M"
    
}

function convertDecimalToRoman(){
    // 3268 => MMMCCLXVIII

    if(userInput.value.length === 1){
        userInput.value = `000${userInput.value}`
    } else if(userInput.value.length === 2){
        userInput.value = `00${userInput.value}`
    }   else if(userInput.value.length === 3){
        userInput.value = `0${userInput.value}`
    }
    const digits = [
        digits1[userInput.value[userInput.value.length - 4]],
        digits2[userInput.value[userInput.value.length - 3]],
        digits3[userInput.value[userInput.value.length - 2]], 
        digits4[userInput.value[userInput.value.length - 1]]
    ];
    for(let i = digits.length - 1; i >= 0 ; i--){
        let zeros = "";
        if(i === 2){zeros = "0"} 
        if(i === 1){zeros = "00"} 
        if(i === 0){zeros = "000"} 
            convertedDisItem[i].textContent = `${userInput.value[i] + zeros} = ${digits[i]}`
    }
    convertedDisItem[4].style.display = "none";
    convertedDisItem[5].style.display = "none";
    convertedDisItem[6].style.display = "none";
    let totalDigit = "";
    for(let i = 0; i < digits.length; i++){
        if(userInput.value[i] !== "0"){
            totalDigit += digits[i]
        }
    }
    convertedDisplay.textContent = `Total : ${totalDigit}`;

}

// count the amount of each roman sign in the inputString
function charCount(str, letter) {
 let letterCount = 0;
 for (let checkedLetter of str){
    if (checkedLetter === letter){
      letterCount++
      }
  }
  return romanValues[letter] * letterCount;
}

function init(){
    for(let item of convertedDisItem){
        item.textContent = "";
        item.style.display = "list-item";
    }
    for(let li of convertedDisItem)
    convertedDisplay.textContent = "Total :";
}