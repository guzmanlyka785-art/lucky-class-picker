let names = [
    "Charlotte",
    "Luna",
    "Harper",
    "Mia",
    "Olivia",
    "Amelia",
    "Isabella",
    "Ethan",
    "Noah",
    "Liam",
    "Lucas",
    "Ava",
    "Sofia",
    "Emma",
    "Mason",
    "Ella",
    "James",
    "Benjamin",
    "Chloe",
    "Daniel"
];

let rotation = 0;
let spinning = false;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const nameInput = document.getElementById("nameInput");
const bulkInput = document.getElementById("bulkInput");

const nameList = document.getElementById("nameList");
const count = document.getElementById("count");

const winnerName = document.getElementById("winnerName");
const winnerMessage = document.getElementById("winnerMessage");

const colors = [
    "#e94f91",
    "#7956d8",
    "#25a9a1",
    "#f2c94c",
    "#3997d5",
    "#ef6655",
    "#80bd8a",
    "#a66bd0",
    "#35b6b0",
    "#f19b45"
];

function drawWheel() {

    const center = 350;
    const radius = 330;

    ctx.clearRect(0, 0, 700, 700);

    if (names.length === 0) {

        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);

        ctx.fillStyle = "#eee7f3";
        ctx.fill();

        ctx.fillStyle = "#6d5b7c";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";

        ctx.fillText("ADD NAMES", center, center);

        return;
    }

    const slice = (Math.PI * 2) / names.length;

    names.forEach((name, index) => {

        const start =
            rotation + index * slice - Math.PI / 2;

        const end = start + slice;

        ctx.beginPath();
        ctx.moveTo(center, center);

        ctx.arc(
            center,
            center,
            radius,
            start,
            end
        );

        ctx.closePath();

        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.stroke();
		
        ctx.save();

        ctx.translate(center, center);
        ctx.rotate(start + slice / 2);

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "white";

        const fontSize = Math.max(
            12,
            Math.min(22, 250 / names.length)
        );

        ctx.font = `bold ${fontSize}px Arial`;

        let label = name;

        while (
            ctx.measureText(label).width > radius * 0.62
            && label.length > 4
        ) {
            label = label.slice(0, -2) + "...";
        }

        ctx.fillText(label, radius - 25, 0);

        ctx.restore();

    });


    ctx.beginPath();

    ctx.arc(
        center,
        center,
        38,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#29223e";
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 6;
    ctx.stroke();

}

function renderNames() {

    nameList.innerHTML = "";

    count.textContent = names.length + " active";

    if (names.length === 0) {

        const li = document.createElement("li");

        li.className = "empty";
        li.textContent = "No names yet. Add someone!";

        nameList.appendChild(li);

    } else {

        names.forEach((name, index) => {

            const li = document.createElement("li");

            const label = document.createElement("span");

            label.textContent = (index + 1) + ". " + name;


            const removeBtn = document.createElement("button");

            removeBtn.textContent = "✕";
            removeBtn.className = "remove";

            removeBtn.addEventListener("click", function() {

                if (spinning) return;

                names.splice(index, 1);

                renderNames();

            });


            li.appendChild(label);
            li.appendChild(removeBtn);

            nameList.appendChild(li);

        });

    }

    spinBtn.disabled = names.length === 0 || spinning;

    drawWheel();

}

function addName(value) {

    const cleanName = value.trim();

    if (cleanName === "") {
        return false;
    }

    names.push(cleanName);

    return true;

}

function addSingleName() {

    if (spinning) return;

    if (addName(nameInput.value)) {

        nameInput.value = "";

        renderNames();

        nameInput.focus();

    }

}

document.getElementById("addBtn")
    .addEventListener("click", addSingleName);

nameInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addSingleName();

    }

});

document.getElementById("importBtn")
    .addEventListener("click", function() {

        if (spinning) return;

        const importedNames = bulkInput.value
            .split(/\r?\n|,/)
            .map(name => name.trim())
            .filter(name => name !== "");

        importedNames.forEach(addName);

        bulkInput.value = "";

        renderNames();

    });

document.getElementById("clearBtn")
    .addEventListener("click", function() {

        if (spinning || names.length === 0) return;

        const answer = confirm(
            "Are you sure you want to remove all names?"
        );

        if (answer) {

            names = [];

            rotation = 0;

            winnerName.textContent = "Ready to play?";

            winnerMessage.textContent =
                "Add names, then spin the wheel.";

            renderNames();

        }

    });


function spinWheel() {

    if (spinning || names.length === 0) {
        return;
    }

    spinning = true;

    spinBtn.disabled = true;

    winnerName.textContent = "Good luck!";

    winnerMessage.textContent =
        "The wheel is spinning...";


    const chosenIndex = Math.floor(
        Math.random() * names.length
    );


    const slice = (Math.PI * 2) / names.length;

    const desiredRotation =
        Math.PI / 2 - (chosenIndex + 0.5) * slice;

    const currentRotation = rotation % (Math.PI * 2);

    let extraRotation =
        desiredRotation - currentRotation;

    extraRotation =
        ((extraRotation % (Math.PI * 2)) +
        (Math.PI * 2)) % (Math.PI * 2);

    extraRotation += 8 * Math.PI * 2;


    const startRotation = rotation;

    const targetRotation =
        startRotation + extraRotation;

    const duration = 4500;

    const startTime = performance.now();

    function animate(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(
            elapsed / duration,
            1
        );
		
        const easeOut =
            1 - Math.pow(1 - progress, 4);


        rotation =
            startRotation +
            (targetRotation - startRotation) * easeOut;


        drawWheel();


        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

            rotation = targetRotation % (Math.PI * 2);

            drawWheel();

            spinning = false;

            spinBtn.disabled = false;


            winnerName.textContent = names[chosenIndex];

            winnerMessage.textContent =
                "🎉 Congratulations! You are the lucky winner! 🎉";

        }

    }


    requestAnimationFrame(animate);

}

spinBtn.addEventListener("click", spinWheel);


renderNames();
