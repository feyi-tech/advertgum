import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Firebase config (replace with your own!)
    const firebaseConfig = {
        apiKey: "AIzaSyBL8Ow_JfdpBg6jBv_1GqzjQrrofRdQmes",
        authDomain: "cinegum-com.firebaseapp.com",
        projectId: "cinegum-com",
        storageBucket: "cinegum-com.firebasestorage.app",
        messagingSenderId: "137389099636",
        appId: "1:137389099636:web:eeeed95885e01802a9df21",
        measurementId: "G-YBQETG45RQ"
    };
    
    let app;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    const auth = getAuth(app);
    //const db =   getFirebase(app);

    // Preview function
    function setupImagePreview(fileInputId, previewImgId) {
      const fileInput = document.getElementById(fileInputId);
      const previewImg = document.getElementById(previewImgId);
      const previewImgName = document.getElementById(`${previewImgId}Name`);

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        previewImgName.textContent = file.name
        if (file) {
          if(file.type == "application/pdf") {

            const reader = new FileReader();
            reader.onload = () => {
              previewImg.src = "/res/icons/pdf.png";
              previewImg.classList.remove('hidden');

              document.getElementById(`${previewImgId}Data`).src = reader.result;
            };
            reader.readAsDataURL(file);

          } else {
            const reader = new FileReader();
            reader.onload = () => {
              previewImg.src = reader.result;
              previewImg.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
          }

        } else {
          previewImg.src = "";
          previewImg.classList.add('hidden');
        }
      });
    }

    // Setup all previews
    setupImagePreview('idUpload', 'idPreview');
    setupImagePreview('selfieUpload', 'selfiePreview');
    setupImagePreview('proofUpload', 'proofPreview');

    // Handle form submit
    document.getElementById('kycForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = e.target.fullName.value.trim();
      const dob = e.target.dob.value;
      const address = e.target.address.value.trim();
      const idType = e.target.idType.value.trim()
      const idImage = document.getElementById('idPreview').src;
      const selfieImage = document.getElementById('selfiePreview').src;
      const proofImage = document.getElementById('proofPreviewData').src;

      console.log("kycForm:", fullName, dob, address, idType, idImage, selfieImage, proofImage)
      //return;

      const submitBtn = document.querySelector("button[type='submit']");
      const originalBtnText = submitBtn.textContent;
      
      // Basic validation
      if (!fullName || !dob || !address || !idType || !idImage || !selfieImage || !proofImage ||
          idImage === "" || selfieImage === "" || proofImage === "") {
        Swal.fire({
          icon: "error",
          title: "Complete the form",
          text: "Please fill in all fields and upload all required images.",
        });
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) {
          Swal.fire({
              icon: "error",
              title: "Please login.",
              text: "Please login to submit your KYC information",
          })
          .then(() => {
            document.location.href = "/login"
          })
          return
        }
        
        submitBtn.disabled = true;
        submitBtn.style.fontStyle = "italic"
        submitBtn.textContent = "Please wait...";
        console.log("submitBtn::", submitBtn)

        setTimeout(() => {
           Swal.fire({
              icon: "success",
              title: "KYC submitted.",
              text: "KYC information submitted and is being processed.",
          })
          .then(() => {
            document.location.href = "/dashboard"
          })
          submitBtn.disabled = false;
          submitBtn.style.fontStyle = "normal"
          submitBtn.textContent = originalBtnText;
        }, 5000);
        /*

        const docRef = db.collection('kyc').doc(user.uid);
        await docRef.set({
          fullName,
          dob,
          address,
          idImage,
          selfieImage,
          proofImage,
          submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'pending'
        });

        document.getElementById('submissionStatus').classList.remove('hidden');
        e.target.reset();
        document.getElementById('idPreview').classList.add('hidden');
        document.getElementById('selfiePreview').classList.add('hidden');
        document.getElementById('proofPreview').classList.add('hidden');*/
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Submission failed",
          text: error.message,
        });
        submitBtn.disabled = false;
        submitBtn.style.fontStyle = "normal"
        submitBtn.textContent = originalBtnText;
      }
});