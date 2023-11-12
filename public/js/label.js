const inputArrayNode = document.querySelectorAll(".input-text");
const labeArraylNode = document.querySelectorAll(".label");

// console.log(inputNodeCheck)

for (i = 0; i < inputArrayNode.length; i++) {
  let inputNode = inputArrayNode[i];
  let labelNode = labeArraylNode[i];

  inputNode.addEventListener("input", () => {
    if (!(inputNode.value == "")) {
      labelNode.classList.add("opacyti__zero");
    } else {
      labelNode.classList.remove("opacyti__zero");
    }
  });
}