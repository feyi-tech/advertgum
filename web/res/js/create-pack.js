
import Swal from 'https://cdn.skypack.dev/sweetalert2';


const save = (e) => {
  Swal.fire(({
      icon: "error",
      title: "Upgrade your Account",
      text: "Please upgrade your account by completing KYC to submit your goal cards."
  }))
  .then(() => {
    location.href = "/kyc"
  })
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    save()

  })
})