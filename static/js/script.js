document.addEventListener("DOMContentLoaded", function() {
    const grammarInput = document.querySelector(".grammar-section textarea");
    const grammarOutput = document.querySelector('.grammar-section .grammar-output');
    const debugWindow = document.querySelector('.debug-section .debug');
    const debugSection  = document.querySelector('.debug-section');

    const phraseTestInput = document.querySelector(".phrase-test-section textarea");
    const phraseTestSection = document.querySelector(".phrase-test-section");
    const phraseTestOutput = document.querySelector(".phrase-output");


    function parsePhrase(value) {
        const body = JSON.stringify({...value});
        fetch('/parse_phrase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                phraseTestOutput.textContent = data.result;
            } else {
                phraseTestOutput.textContent = "Phrase parse error: " + (data.error || "");
            }
        })
        .catch(error => {
            debugWindow.textContent = "Network or Server Error";
            phraseTestOutput.textContent = ":"; // Reset the output window
        });
    }


    function parseGrammar(value) {
        const body = JSON.stringify({...value});

        fetch('/parse_grammar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                grammarOutput.textContent = data.result;
                debugWindow.textContent = ""; // Clear the debug window
                debugSection.style.display = 'none';
                phraseTestSection.style.display = 'flex'
                if (phraseTestInput.value) {
                    //attempt to parse with new grammar
                    parsePhrase({phrase: phraseTestInput.value})
                }
            } else {
                debugSection.style.display = 'flex';
                phraseTestSection.style.display = 'none'
                debugWindow.textContent = "Grammar parse error: " + (data.error || "");
                grammarOutput.textContent = "Error"; // Reset the output window
            }
        })
        .catch(error => {
            debugWindow.textContent = "Network or Server Error";
            grammarOutput.textContent = ":"; // Reset the output window
        });
    }
    grammarInput.addEventListener("input", function() {
        parseGrammar({grammar: grammarInput.value});
    });
    phraseTestInput.addEventListener("input", function() {
        parsePhrase({phrase: phraseTestInput.value})
    });
});
