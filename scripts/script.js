// Mendapatkan data dari Firebase dan menampilkannya di elemen HTML
const ambilPH = document.querySelector(`[data-button="ambilPH"]`);
const ambilPPM = document.querySelector(`[data-button="ambilPPM"]`);
const hasilPH = document.querySelector(`[data-firebase="hasilPH"]`);
const hasilPPM = document.querySelector(`[data-firebase="hasilPPM"]`);
const maksimum_ph = document.querySelector(`[data-input="maksimum_ph"]`);
const minimum_ph = document.querySelector(`[data-input="minimum_ph"]`);
const batas_nutrisi = document.querySelector(`[data-input="batas_nutrisi" `);
const submitPPM = document.querySelector(`[data-button="submitPPM"]`);
const submitmaksimum_ph = document.querySelector(`[data-button="submitmaksimum_ph"]`);
const submitminimum_ph = document.querySelector(`[data-button="submitminimum_ph"]`);
const pumpNutrisiAContainer = document.getElementById('pump_nutrisiA-container');
const pumpNutrisiBContainer = document.getElementById('pump_nutrisiB-container');
const pumpPhDownContainer = document.getElementById('pump_phdown-container');
const pumpPhUpContainer = document.getElementById('pump_phup-container');


////////Pengambilan data pH////////
function ambilDataPH() {
    firebase.database().ref('monitoring/1').limitToFirst(1).orderByKey().once("value", (snap) => {
        hasilPH.innerHTML = (`
            <div>${snap.val().PHair}</div>
        `);
    });
}

//////////Pengambilan data PPM//////
function ambilDataPPM() {
    firebase.database().ref('monitoring/1').limitToFirst(2).orderByKey().once("value", (snap) => {
        hasilPPM.innerHTML = (`
            <div>${snap.val().nutrisi}</div>
        `);
    });
}

ambilPH.onclick = () => {
    // Hapus tombol "ambilPH"
    ambilPH.remove();
    // Panggil fungsi untuk mengambil data pH
    ambilDataPH();
    // Atur refresh otomatis setiap 5 detik
    setInterval(() => {
        ambilDataPH();
    }, 5000); // 5000 milidetik = 5 detik
}

ambilPPM.onclick = () => {
    // Hapus tombol "ambilPPM"
    ambilPPM.remove();
    // Panggil fungsi untuk mengambil data PPM
    ambilDataPPM();
    // Atur refresh otomatis setiap 5 detik
    setInterval(() => {
        ambilDataPPM();
    }, 5000); // 5000 milidetik = 5 detik
}

//kontrol batas nutrisi//

submitPPM.onclick = () => {

    const data = {
        batas_nutrisi: batas_nutrisi.value,
    }

    firebase.database().ref('kontrol').update(data);
}

//kontrol batas ph maksimum//

submitmaksimum_ph.onclick = () => {

    const data = {
        maksimum_ph: maksimum_ph.value,
    }

    firebase.database().ref('kontrol').update(data);
}

//kontrol batas ph minimum//

submitminimum_ph.onclick = () => {

    const data = {
        minimum_ph: minimum_ph.value,
    }

    firebase.database().ref('kontrol').update(data);
}

// Ganti 'status' dengan path yang sesuai di database Anda
const databaseRefStatus = firebase.database().ref('status');

// Fungsi untuk menampilkan nilai boolean dan mengubah warna
function displayBooleanData(container, snapshot) {
    const data = snapshot.val();
    if (data === true) {
        container.innerHTML = 'ON';
        container.classList.add('red');
        container.classList.remove('green');
    } else if (data === false) {
        container.innerHTML = 'OFF';
        container.classList.add('green');
        container.classList.remove('red');
    } else {
        container.innerHTML = 'Nilai tidak valid';
    }
}

// Mendapatkan data dari child paths di bawah "status"
databaseRefStatus.child('pump_nutrisiA').on('value', (snapshot) => {
    displayBooleanData(pumpNutrisiAContainer, snapshot);
});

databaseRefStatus.child('pump_nutrisiB').on('value', (snapshot) => {
    displayBooleanData(pumpNutrisiBContainer, snapshot);
});

databaseRefStatus.child('pump_phdown').on('value', (snapshot) => {
    displayBooleanData(pumpPhDownContainer, snapshot);
});

databaseRefStatus.child('pump_phup').on('value', (snapshot) => {
    displayBooleanData(pumpPhUpContainer, snapshot);
});

