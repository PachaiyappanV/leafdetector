const imageInputDOM = document.querySelector("#image");
const fileFormDOM = document.querySelector(".form");
const leaf = document.querySelector(".leafname");
const uploadleaf = document.querySelector(".uploadleaf");
const formData = new FormData();
let imageFile = "";

imageInputDOM.addEventListener("change", async (e) => {
  imageFile = e.target.files[0];
  formData.append("image", imageFile);
  console.log(imageFile);
});

fileFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    leaf.textContent = "...Figuring out";
    const res = await axios.post(`/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    leaf.textContent = res.data.leafname;
  } catch (error) {
    console.log(error);
  }
});
