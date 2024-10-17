import React, { useEffect } from "react";
import countries from "../data";

const Translate = () => {
  useEffect(() => {
    const fromText = document.querySelector(".from-text");
    const toText = document.querySelector(".to-text");
    const exchangeIcon = document.querySelector(".exchange");
    const selectTag = document.querySelectorAll("select");
    const icons = document.querySelectorAll(".row i");
    let debounceTimeout;

    // Populating select tag options with countries.
    selectTag.forEach((tag, id) => {
      for (let country_code in countries) {
        let selected =
          id === 0
            ? country_code === "en-GB"
              ? "selected"
              : ""
            : country_code === "hi-IN"
            ? "selected"
            : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
      }
    });

    // To make textarea empty when language is changed.
    selectTag[0].addEventListener("change", () => {
      fromText.value = "";
      toText.value = "";
    });

    // To get translation in changed language.
    selectTag[1].addEventListener("change", () => {
      if (fromText.value) {
        translateText();
      }
    });

    // Swap function for languages and text.
    // Ensure the event listener is added only once
    if (!exchangeIcon.hasEventListener) {
      exchangeIcon.addEventListener("click", () => {
        try {
          let text1 = fromText.value;
          let text2 = toText.value;
          let lang1 = selectTag[0].value;
          let lang2 = selectTag[1].value;
          // console.log(text1, text2, lang1, lang2);

          // Swapping languages and text
          selectTag[0].value = lang2;
          selectTag[1].value = lang1;
          fromText.value = text2;
          toText.value = text1;
          // console.log(fromText.value, toText.value, selectTag[0].value, selectTag[1].value);

          // Optionally trigger translation after swapping
          // if (fromText.value) {
          //   debounceTranslate();
          // }
        } catch (error) {
          console.error("Error swapping text or languages:", error);
          alert("An error occurred while swapping languages. Please try again.");
        }
      });

      // Mark that the event listener has been added
      exchangeIcon.hasEventListener = true;
    }

    // Translate function
    const translateText = async () => {
      let text = fromText.value.trim();
      let translateFrom = selectTag[0].value;
      let translateTo = selectTag[1].value;
      if (!text) return;
      toText.setAttribute("placeholder", "Translating...");
      
      let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
      
      try {
        let res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch translation");
        let data = await res.json();

        toText.value = data.responseData.translatedText;
        data.matches.forEach((data) => {
          if (data.id === 0) {
            toText.value = data.translation;
          }
        });
      } catch (error) {
        console.error("Translation API error:", error);
        toText.value = "Translation error. Please try again.";
      } finally {
        toText.setAttribute("placeholder", "Translation");
      }
    };

    // Debounce function to limit API requests
    const debounceTranslate = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(translateText, 500); // 500ms delay
    };

    // Automatically translate as the user types
    fromText.addEventListener("keyup", () => {
      if (!fromText.value) {
        toText.value = "";
        return;
      }
      debounceTranslate();
    });

    // Copy or speak text based on clicked icon
    icons.forEach((icon) => {
      icon.addEventListener("click", async ({ target }) => {
        if (!fromText.value || !toText.value) return;
        
        if (target.classList.contains("fa-copy")) {
          try {
            if (target.id === "from") {
              await navigator.clipboard.writeText(fromText.value);
              alert("Copied from text!");
            } else {
              await navigator.clipboard.writeText(toText.value);
              alert("Copied translated text!");
            }
          } catch (error) {
            console.error("Clipboard copy error:", error);
            alert("Failed to copy text. Please try again.");
          }
        } else {
          try {
            let utterance;
            if (target.id === "from") {
              utterance = new SpeechSynthesisUtterance(fromText.value);
              utterance.lang = selectTag[0].value;
            } else {
              utterance = new SpeechSynthesisUtterance(toText.value);
              utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
          } catch (error) {
            console.error("Speech synthesis error:", error);
            alert("Speech synthesis failed. Please try again.");
          }
        }
      });
    });
  }, []);

  return (
    // <>
    //   <div className="container">
    //     <div className="wrapper">
    //       <div className="text-input">
    //         <textarea
    //           spellCheck="false"
    //           className="from-text"
    //           placeholder="Enter text"
    //         ></textarea>
    //         <textarea
    //           spellCheck="false"
    //           readOnly
    //           disabled
    //           className="to-text"
    //           placeholder="Translation"
    //         ></textarea>
    //       </div>
    //       <ul className="controls">
    //         <li className="row from">
    //           <div className="icons">
    //             <i id="from" className="fas fa-volume-up"></i>
    //             <i id="from" className="fas fa-copy"></i>
    //           </div>
    //           <select></select>
    //         </li>
    //         <li className="exchange">
    //           <i className="fas fa-exchange-alt"></i>
    //         </li>
    //         <li className="row to">
    //           <select></select>
    //           <div className="icons">
    //             <i id="to" className="fas fa-volume-up"></i>
    //             <i id="to" className="fas fa-copy"></i>
    //           </div>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </>
    <div className="app-container">
      <div className="wrapper">
        <div className="text-input">
          <textarea
            spellCheck="false"
            className="from-text"
            placeholder="Enter text"
          ></textarea>
          <textarea
            spellCheck="false"
            readOnly
            disabled
            className="to-text"
            placeholder="Translation"
          ></textarea>
        </div>
        <ul className="controls">
          <li className="row from">
            <div className="icons">
              <i id="from" className="fas fa-volume-up"></i>
              <i id="from" className="fas fa-copy"></i>
            </div>
            <select></select>
          </li>
          <li className="exchange">
            <i className="fas fa-exchange-alt"></i>
          </li>
          <li className="row to">
            <select></select>
            <div className="icons">
              <i id="to" className="fas fa-volume-up"></i>
              <i id="to" className="fas fa-copy"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Translate;
