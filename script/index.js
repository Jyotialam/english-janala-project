// যেকোনো array (যেমন synonyms) কে নিয়ে HTML <span> আকারে সাজিয়ে দেয়।
const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class='btn'>${el}</span>`);
  return htmlElements.join(" ");
};
//*************************************************************** */
//শব্দকে ব্রাউজারের speech API ব্যবহার করে উচ্চারণ করে শোনায়।
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
//**************************************************************** */
// লোড হওয়ার সময় spinner (loading animation) দেখায়, আর word-container লুকায়। ডাটা লোড হয়ে গেলে আবার spinner লুকায়, word-container দেখায়।
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};
//*************************************************************** */
//1সব Lesson এর লিস্ট API থেকে নিয়ে আসে। তারপর displayLesson() দিয়ে দেখায়।
const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") //promise of response
    .then((response) => response.json()) //promise of json data

    .then((json) => displayLesson(json.data));
};
//************************************************************** */
// Lesson বাটন থেকে .active class রিমুভ করে, যাতে একসাথে অনেক বাটন active না হয়ে যায়।
const removeActive = () => {
  const lessonBtns = document.querySelectorAll(".lesson-btn");
  // console.log(lessonBtn);
  lessonBtns.forEach((lessonBtn) => lessonBtn.classList.remove("active"));
};
// নির্দিষ্ট lesson এ ক্লিক করলে সেই Lesson এর সব শব্দ API থেকে আনে। তারপর displayLevelWord() দিয়ে শব্দ দেখায়।
const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");

      displayLevelWord(json.data);
    });
};
//**************************************************************** */
// একটি নির্দিষ্ট শব্দে ক্লিক করলে সেই শব্দের বিস্তারিত তথ্য আনে। যেমন meaning, example, synonyms ইত্যাদি।
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  console.log(url);
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};
/**
 * শব্দের meaning, example, synonym দেখায়। Synonym array থাকলে সেটাকে সুন্দর করে সাজিয়ে দেখায়। তারপর modal popup এ দেখায়।
 */
const displayWordDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `<div>
            <h2 class="text-2xl font-bold">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${
    word.pronunciation
  })
            </h2>
          </div>
          <div class="d">
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
          </div>
          <div class="d">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div class="justify-center">
            <h2 class="font-bold mb-3">Synonym</h2>
            <div class="">${createElements(word.synonyms)}</div>
          </div> `;
  document.getElementById("word_modal").showModal();
};
/**
 * Lesson এর সব শব্দকে card আকারে দেখায়। প্রতিটি শব্দে দুটি বাটন থাকে: Details (অর্থাৎ meaning, synonym দেখায়) আর Sound (উচ্চারণ শোনায়)।
 */

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length == 0) {
    wordContainer.innerHTML = `<div class="col-span-full text-center space-y-3 font-bangla">
     <img class="mx-auto w-[90px]" src="./assets/alert-error.png" alt="">
        <p class="text-[11px] font-normal text-[#79716b] ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-3xl font-medium">নেক্সট Lesson এ যান</h2>
      </div>`;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    // console.log(word);

    const card = document.createElement("div");
    card.innerHTML = `
     <div
        class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4"
      >
        <h2 class="font-bold text-2xl">${
          word.word ? word.word : "শব্দ পাওয়া যায়নি "
        }</h2>
        <p class="text-lg font-semibold">Meaning /Pronounciation</p>
        <p class="font-bold text-2xl font-bangla">"${
          word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
        }/${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}</p>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${
            word.id
          })" class="btn bg-[#1a91ff1a] hover:bg-[#1A91FF80] rounded-md">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button onclick ="pronounceWord('${
            word.word
          }')" class="btn bg-[#1a91ff1a] hover:bg-[#1A91FF80] rounded-md">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>`;
    wordContainer.append(card);
  });
  manageSpinner(false);
};
//**************************************************************** */
//সব Lesson বাটন তৈরি করে দেখায়।
const displayLesson = (lessons) => {
  //1.get container & do empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  //2.go for every lesson
  for (let lesson of lessons) {
    // console.log(lesson);

    //3.create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button id="lesson-btn-${lesson.level_no}" onclick ='loadLevelWord(${lesson.level_no})' class="btn btn-outline btn-primary lesson-btn">
    <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
    </button>`;

    //4. append it
    levelContainer.append(btnDiv);
  }
};
//**************************************************************** */
loadLessons();
//Search বাটনে ক্লিক করলে সব শব্দ থেকে মিলে যাওয়া শব্দ খুঁজে আনে। তারপর displayLevelWord() দিয়ে দেখায়।
document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(filterWords);
    });
});
//**************************************************************** */
