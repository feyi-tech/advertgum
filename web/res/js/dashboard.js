
import Swal from 'https://cdn.skypack.dev/sweetalert2';


document.addEventListener("DOMContentLoaded", () => {
  const withdraw = document.querySelector("#withdraw");
  const fundwallet = document.querySelector("#fundwallet");

  withdraw.addEventListener("click", async (e) => {
    Swal.fire(({
        icon: "error",
        title: "Low Earnings",
        text: "You need to earn at least ₦10,000 to withdraw your earnings."
    }))
  })

  fundwallet.addEventListener("click", async (e) => {
    Swal.fire(({
        icon: "error",
        title: "Upgrade your Account",
        text: "Upgrade your account by completing KYC to enable wallet funding."
    }))
  })
})