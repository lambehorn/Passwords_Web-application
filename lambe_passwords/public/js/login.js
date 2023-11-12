

const swithNode = document.querySelector(".input-swith");
const frameNode = document.querySelector(".frame");
const carouselNode = document.querySelector(".frame__carousel");
const itemNode = document.querySelector(".frame__carousel__item");
const fakeRoundNode = document.querySelector(".fake__round");
const fakeNode = document.querySelector(".fake");

frameNode.style.width = `${itemNode.clientWidth}px`;
frameNode.style.height = `${itemNode.clientHeight}px`;

swithNode.addEventListener("click", () => {
  if (swithNode.checked) {
    carouselNode.style.transform = `translateX(-${itemNode.clientWidth}px)`;
    fakeRoundNode.style.transform = `translate(0px, -50%)`;
    fakeNode.classList.remove("color1");
  } else {
    fakeRoundNode.style.transform = `translate(-12px, -50%)`;
    carouselNode.style.transform = `translateX(0px)`;
    fakeNode.classList.add("color1");
  }
});

const bodyNode = document.body;
const setBody = () => {
  bodyNode.style.height = `${document.documentElement.clientHeight}px`;
};
setBody()
window.addEventListener("resize", () => {
  bodyNode.style.height = `${document.documentElement.clientHeight}px`;
});
