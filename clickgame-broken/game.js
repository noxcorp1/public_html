const widget_container = document.getElementById("widget-container");
const stores = document.getElementsByClassName("store");
const score_element = document.getElementById("score");
let score = 5;
let super_gompei_count = 0;

function changeScore(amount) {
    score += amount;
    document.getElementById("score").innerHTML = "Score: "+score;
    //set score element

    
    // Update the stores to show ones that are too expensive
    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));

        if (score >= cost) {
            store.removeAttribute("broke");
        } else {
            store.setAttribute("broke", "");
        }
    }
}
function buy(store) {
    const cost = parseInt(store.getAttribute("cost"));
    if (cost <= score) {
        changeScore(-cost);

        // check available to buy
        // change score

        if (store.getAttribute("name") === "Super-Gompei") {
            const super_gompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
            // If Super-Gompei already exists
            if (super_gompei) {
                super_gompei.setAttribute("reap", (parseInt(super_gompei.getAttribute("reap")) + 100));
                super_gompei_count += 1;
                document.body.style = "--gompei-count: " + super_gompei_count + ";"
                return;
            }
        }

        // clone node for widget, and add to container
        const widget = store.firstElementChild.cloneNode(true);
        widget.onclick = () => {
            harvest(widget);
        }
        widget_container.appendChild(widget);

        if (widget.getAttribute("auto") == 'true') {
            widget.setAttribute("harvesting", "");
            setup_end_harvest(widget);
        }
    }
}

function setup_end_harvest(widget) {
    setTimeout(() => {
        // Remove the harvesting flag
        widget.removeAttribute("harvesting");
        // If automatic, start again
        if (widget.getAttribute("auto") == 'true') {
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function harvest(widget) {
    // Only run if currently not harvesting
    if (widget.hasAttribute("harvesting")) return;
    // Set harvesting flag
    widget.setAttribute("harvesting", "");

    // If manual, collect points now
    changeScore(parseInt(widget.getAttribute("reap")));
    showPoint(widget);

    setup_end_harvest(widget);
}


function showPoint(widget) {
    let number = document.createElement("span");
    number.className = "point";
    number.innerHTML = "+" + widget.getAttribute("reap");
    number.onanimationend = () => {
        widget.removeChild(number);
    }
    widget.appendChild(number);
}

changeScore(0);