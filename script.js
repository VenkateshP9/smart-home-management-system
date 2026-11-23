
/* ==========================================
   SMART HOME MANAGEMENT SYSTEM
   Complete JavaScript
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ----------------------------------------
    // 1. ELEMENTS
    // ----------------------------------------

    const app = document.querySelector(".app");
    const welcomePages = document.querySelectorAll("#welcomePage");
    const getStartedButtons = document.querySelectorAll("#getStartedBtn");

    const roomList = document.getElementById("roomList");
    const deviceList = document.getElementById("deviceList");
    const roomModal = document.getElementById("roomModal");
    const deviceModal = document.getElementById("deviceModal");

    const roomNameInput = document.getElementById("roomName");
    const deviceNameInput = document.getElementById("deviceName");
    const deviceTypeInput = document.getElementById("deviceType");

    const roomSection = document.querySelector(".room-section");
    const deviceSection = document.getElementById("deviceSection");

    const quickDeviceGrid = document.querySelector(
        "#dashboard .device-grid"
    );

    const allDevicesContainer = document.querySelector(
        "#devices .all-devices"
    );

    // ----------------------------------------
    // 2. DEFAULT DATA
    // ----------------------------------------

    const defaultRooms = [
        {
            id: 1,
            name: "Living Room",
            devices: [
                { id: 101, name: "Living Room Light", type: "💡", on: false },
                { id: 102, name: "Smart TV", type: "📺", on: false }
            ]
        },
        {
            id: 2,
            name: "Bedroom",
            devices: [
                { id: 201, name: "Bedroom Fan", type: "🌀", on: true },
                { id: 202, name: "Bedroom AC", type: "❄️", on: true }
            ]
        },
        {
            id: 3,
            name: "Kitchen",
            devices: [
                { id: 301, name: "Kitchen Light", type: "💡", on: false },
                { id: 302, name: "Smart Plug", type: "🔌", on: false }
            ]
        },
        {
            id: 4,
            name: "Bathroom",
            devices: [
                { id: 401, name: "Bathroom Light", type: "💡", on: false },
                { id: 402, name: "Exhaust Fan", type: "🌬️", on: false }
            ]
        }
    ];

    let rooms = JSON.parse(
        localStorage.getItem("smartHomeRooms")
    ) || defaultRooms;

    let selectedRoomId = null;

    // ----------------------------------------
    // 3. SAVE DATA
    // ----------------------------------------

    function saveData() {
        localStorage.setItem(
            "smartHomeRooms",
            JSON.stringify(rooms)
        );
    }

    // ==========================================
    // SMART SCENES - FIXED VERSION
    // ==========================================

    document.querySelectorAll("[data-scene]").forEach(button => {

        button.addEventListener("click", () => {
            const scene = button.dataset.scene;
            activateScene(scene);
        });

    });

    function activateScene(scene) {

        if (!Array.isArray(rooms)) {
            showToast("Room data not available!");
            return;
        }

        // GOOD MORNING
        if (scene === "morning") {

            rooms.forEach(room => {

                const roomName = room.name.toLowerCase();

                if (
                    roomName.includes("living") ||
                    roomName.includes("kitchen")
                ) {

                    room.devices.forEach(device => {

                        const deviceName = device.name.toLowerCase();

                        if (
                            deviceName.includes("light") ||
                            device.type === "💡"
                        ) {
                            device.on = true;
                        }

                    });
                }

            });

            showToast("🌅 Good Morning Scene Activated!");
        }

        // GOOD NIGHT
        else if (scene === "night") {

            rooms.forEach(room => {
                room.devices.forEach(device => {
                    device.on = false;
                });
            });

            showToast("🌙 Good Night! All Devices OFF!");
        }

        // AWAY FROM HOME
        else if (scene === "away") {

            rooms.forEach(room => {
                room.devices.forEach(device => {
                    device.on = false;
                });
            });

            securityData.armed = true;
            securityData.doorLocked = true;
            securityData.windowOpen = false;

            saveSecurity();
            renderSecurity();

            addSecurityHistory(
                "Away From Home scene activated",
                "success"
            );

            showToast("🚪 Away Mode Activated! Security Armed!");
        }

        // MOVIE TIME
        else if (scene === "movie") {

            rooms.forEach(room => {

                const roomName = room.name.toLowerCase();

                room.devices.forEach(device => {

                    const deviceName = device.name.toLowerCase();

                    // Turn TV ON
                    if (
                        deviceName.includes("tv") ||
                        deviceName.includes("television") ||
                        device.type === "📺"
                    ) {
                        device.on = true;
                    }

                    // Turn living room lights OFF
                    if (
                        roomName.includes("living") &&
                        (
                            deviceName.includes("light") ||
                            device.type === "💡"
                        )
                    ) {
                        device.on = false;
                    }

                });

            });

            showToast("🎬 Movie Time Activated!");
        }

        else {
            showToast("Unknown scene!");
            return;
        }

        // SAVE UPDATED DEVICE DATA
        saveData();

        // REFRESH ALL DEVICE DISPLAYS
        renderDashboard();
        renderRooms();
        renderRoomDevices();
        renderAllDevices();

    }

    

// ==========================================
// SCENE SUCCESS MESSAGE
// ==========================================

function showSceneMessage(message) {

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    if (toast && toastMessage) {

        toastMessage.textContent = message;

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);

    } else {

        alert(message);

    }

}


    // ----------------------------------------
    // 4. HELPER FUNCTIONS
    // ----------------------------------------

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function getAllDevices() {
        return rooms.flatMap(room =>
            room.devices.map(device => ({
                ...device,
                roomName: room.name,
                roomId: room.id
            }))
        );
    }

    function showToast(message) {
        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toastMessage");

        if (!toast || !toastMessage) {
            alert(message);
            return;
        }

        toastMessage.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    // ----------------------------------------
    // 5. WELCOME PAGE
    // ----------------------------------------

    welcomePages.forEach(page => {
        page.style.display = "flex";
    });

    if (app) {
        app.classList.add("hidden");
    }

    getStartedButtons.forEach(button => {
        button.addEventListener("click", () => {
            welcomePages.forEach(page => {
                page.style.display = "none";
            });

            if (app) {
                app.classList.remove("hidden");
            }

            showSection("dashboard");
            renderDashboard();
        });
    });

    // ----------------------------------------
    // 6. NAVIGATION
    // ----------------------------------------

    
function showSection(sectionName) {
    // Hide all normal modules
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    // Hide room management sections
    if (roomSection) {
        roomSection.style.display = "none";
    }

    if (deviceSection) {
        deviceSection.classList.add("hidden");
    }

    // Show selected module
    if (sectionName === "rooms") {
        if (roomSection) {
            roomSection.style.display = "block";
        }
        renderRooms();
    } else {
        const section = document.getElementById(sectionName);

        if (section) {
            section.classList.add("active");
        }
    }

    // Update sidebar
    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.section === sectionName
        );
    });
    if (sectionName === "security") {
    renderSecurity();
}

if (sectionName === "family") {
    renderFamily();
}

    // Update page title
    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.textContent =
            sectionName.charAt(0).toUpperCase() +
            sectionName.slice(1);
    }

    if (sectionName === "devices") {
        renderAllDevices();
    }
}

    document.querySelectorAll("[data-section]").forEach(button => {
        button.addEventListener("click", () => {
            showSection(button.dataset.section);
        });
    });

    document.querySelectorAll("[data-section-link]").forEach(button => {
        button.addEventListener("click", () => {
            showSection(button.dataset.sectionLink);
        });
    });

    // ----------------------------------------
    // 7. DISPLAY ROOMS
    // ----------------------------------------

    function renderRooms() {

        if (!roomList) return;

        roomList.innerHTML = "";

        if (rooms.length === 0) {
            roomList.innerHTML = `
                <p class="empty-message">
                    No rooms added. Click Add Room to create one.
                </p>
            `;
            return;
        }

        rooms.forEach(room => {

            const activeCount = room.devices.filter(
                device => device.on
            ).length;

            const card = document.createElement("div");

            card.className = "room-card";

            card.innerHTML = `
                <div class="room-card-content"
                     data-open-room="${room.id}"
                     style="cursor:pointer">

                    <div class="room-icon">🏠</div>

                    <h3>${escapeHTML(room.name)}</h3>

                    <p>${room.devices.length} Devices</p>

                    <small>${activeCount} Active</small>
                </div>

                <div class="room-actions">
                    <button data-open-room="${room.id}">
                        View Devices
                    </button>

                    <button class="delete-btn"
                            data-delete-room="${room.id}">
                        Delete
                    </button>
                </div>
            `;

            roomList.appendChild(card);
        });
    }

    // ----------------------------------------
    // 8. ADD ROOM
    // ----------------------------------------

    document.getElementById("addRoomBtn")
        ?.addEventListener("click", () => {

            roomNameInput.value = "";
            roomModal.classList.remove("hidden");
            roomNameInput.focus();
        });

    document.getElementById("closeRoomBtn")
        ?.addEventListener("click", () => {
            roomModal.classList.add("hidden");
        });

    document.getElementById("saveRoomBtn")
        ?.addEventListener("click", () => {

            const name = roomNameInput.value.trim();

            if (!name) {
                alert("Please enter room name!");
                return;
            }

            const exists = rooms.some(room =>
                room.name.toLowerCase() === name.toLowerCase()
            );

            if (exists) {
                alert("This room already exists!");
                return;
            }

            rooms.push({
                id: Date.now(),
                name: name,
                devices: []
            });

            saveData();
            renderRooms();

            roomModal.classList.add("hidden");

            showToast("Room added successfully!");
        });

    // ----------------------------------------
    // 9. DELETE ROOM
    // ----------------------------------------

    roomList?.addEventListener("click", event => {

        const deleteButton = event.target.closest("[data-delete-room]");

        if (deleteButton) {

            const id = Number(deleteButton.dataset.deleteRoom);

            const room = rooms.find(room => room.id === id);

            if (!room) return;

            if (!confirm(`Delete ${room.name} and all its devices?`)) {
                return;
            }

            rooms = rooms.filter(room => room.id !== id);

            if (selectedRoomId === id) {
                selectedRoomId = null;
                deviceSection.classList.add("hidden");
            }

            saveData();
            renderRooms();
            renderDashboard();

            showToast("Room deleted successfully!");

            return;
        }

        const openButton = event.target.closest("[data-open-room]");

        if (openButton) {
            openRoom(Number(openButton.dataset.openRoom));
        }
    });

    // ----------------------------------------
    // 10. OPEN ROOM AND SHOW DEVICES
    // ----------------------------------------

    function openRoom(id) {

        const room = rooms.find(room => room.id === id);

        if (!room) return;

        selectedRoomId = id;

        if (deviceSection) {
            deviceSection.classList.remove("hidden");
            deviceSection.style.display = "block";
        }

        const heading = document.getElementById("selectedRoomName");

        if (heading) {
            heading.textContent = room.name + " Devices";
        }

        renderRoomDevices();

        deviceSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // ----------------------------------------
    // 11. DISPLAY ROOM DEVICES
    // ----------------------------------------

    function renderRoomDevices() {

        const room = rooms.find(
            room => room.id === selectedRoomId
        );

        if (!room || !deviceList) return;

        deviceList.innerHTML = "";

        if (room.devices.length === 0) {
            deviceList.innerHTML = `
                <p class="empty-message">
                    No devices in this room. Add your first device!
                </p>
            `;
            return;
        }

        room.devices.forEach(device => {

            const card = document.createElement("div");

            card.className = "device-card";

            card.innerHTML = `
                <div class="device-top">
                    <div class="device-icon">
                        ${escapeHTML(device.type)}
                    </div>

                    <label class="switch">
                        <input type="checkbox"
                               class="device-toggle"
                               data-room-device="${device.id}"
                               ${device.on ? "checked" : ""}>
                        <span></span>
                    </label>
                </div>

                <h3>${escapeHTML(device.name)}</h3>

                <p>${device.on ? "ON" : "OFF"}</p>

                <button class="delete-btn"
                        data-remove-device="${device.id}">
                    Remove Device
                </button>
            `;

            deviceList.appendChild(card);
        });
    }

    // ----------------------------------------
    // 12. ADD DEVICE
    // ----------------------------------------

    document.getElementById("addDeviceBtn")
        ?.addEventListener("click", () => {

            if (selectedRoomId === null) {
                alert("Please select a room first!");
                return;
            }

            deviceNameInput.value = "";
            deviceModal.classList.remove("hidden");
            deviceNameInput.focus();
        });

    document.getElementById("closeDeviceBtn")
        ?.addEventListener("click", () => {
            deviceModal.classList.add("hidden");
        });

    document.getElementById("saveDeviceBtn")
        ?.addEventListener("click", () => {

            const name = deviceNameInput.value.trim();
            const type = deviceTypeInput.value;

            if (!name) {
                alert("Please enter device name!");
                return;
            }

            const room = rooms.find(
                room => room.id === selectedRoomId
            );

            if (!room) {
                alert("Please select a room!");
                return;
            }

            const exists = room.devices.some(device =>
                device.name.toLowerCase() === name.toLowerCase()
            );

            if (exists) {
                alert("This device already exists in this room!");
                return;
            }

            room.devices.push({
                id: Date.now(),
                name: name,
                type: type,
                on: false
            });

            saveData();

            renderRoomDevices();
            renderRooms();
            renderDashboard();
            renderAllDevices();

            deviceModal.classList.add("hidden");

            showToast("Device added successfully!");
        });

    // ----------------------------------------
    // 13. REMOVE DEVICE
    // ----------------------------------------

    deviceList?.addEventListener("click", event => {

        const button = event.target.closest("[data-remove-device]");

        if (!button) return;

        const deviceId = Number(button.dataset.removeDevice);

        const room = rooms.find(
            room => room.id === selectedRoomId
        );

        if (!room) return;

        if (!confirm("Are you sure you want to remove this device?")) {
            return;
        }

        room.devices = room.devices.filter(
            device => device.id !== deviceId
        );

        saveData();

        renderRoomDevices();
        renderRooms();
        renderDashboard();
        renderAllDevices();

        showToast("Device removed successfully!");
    });

    // ----------------------------------------
    // 14. DEVICE ON / OFF
    // ----------------------------------------

function updateDevice(deviceId, checked) {

    let foundDevice = null;

    rooms.forEach(room => {

        const device = room.devices.find(
            item => item.id === deviceId
        );

        if (device) {
            device.on = checked;
            foundDevice = device;
        }

    });

    if (!foundDevice) return;

    saveData();

    // Record device activity
    addDeviceHistory(
        foundDevice.name,
        checked ? "ON" : "OFF"
    );

    renderDashboard();
    renderRooms();
    renderRoomDevices();
    renderAllDevices();
}


    // ----------------------------------------
    // 15. RENDER DASHBOARD DEVICES
    // ----------------------------------------

    function renderDashboard() {

        const devices = getAllDevices();

        if (quickDeviceGrid) {

            quickDeviceGrid.innerHTML = "";

            devices.slice(0, 4).forEach(device => {

                const card = document.createElement("div");

                card.className = "device-card";

                card.innerHTML = `
                    <div class="device-top">
                        <div class="device-icon">
                            ${escapeHTML(device.type)}
                        </div>

                        <label class="switch">
                            <input type="checkbox"
                                   class="device-toggle"
                                   data-quick-device="${device.id}"
                                   ${device.on ? "checked" : ""}>
                            <span></span>
                        </label>
                    </div>

                    <h3>${escapeHTML(device.name)}</h3>
                    <p>${escapeHTML(device.roomName)}</p>
                `;

                quickDeviceGrid.appendChild(card);
            });
        }

        const activeCount = devices.filter(
            device => device.on
        ).length;

        const activeElement = document.getElementById("activeDevices");

        if (activeElement) {
            activeElement.textContent = activeCount;
        }
    }

    // ----------------------------------------
    // 16. RENDER ALL DEVICES
    // ----------------------------------------

    function renderAllDevices() {

        if (!allDevicesContainer) return;

        allDevicesContainer.innerHTML = "";

        const devices = getAllDevices();

        if (devices.length === 0) {
            allDevicesContainer.innerHTML = `
                <p class="empty-message">
                    No devices available. Add devices from Rooms.
                </p>
            `;
            return;
        }

        devices.forEach(device => {

            const card = document.createElement("div");

            card.className = "large-device-card";

            card.innerHTML = `
                <span class="large-device-icon">
                    ${escapeHTML(device.type)}
                </span>

                <div>
                    <h3>${escapeHTML(device.name)}</h3>
                    <p>${escapeHTML(device.roomName)}</p>
                    <small>${device.on ? "ON" : "OFF"}</small>
                </div>

                <label class="switch">
                    <input type="checkbox"
                           class="device-toggle"
                           data-all-device="${device.id}"
                           ${device.on ? "checked" : ""}>
                    <span></span>
                </label>
            `;

            allDevicesContainer.appendChild(card);
        });
    }

    // ----------------------------------------
    // 17. TURN EVERYTHING OFF
    // ----------------------------------------

    document.getElementById("allOffBtn")
        ?.addEventListener("click", () => {

            rooms.forEach(room => {
                room.devices.forEach(device => {
                    device.on = false;
                });
            });

            saveData();

            renderDashboard();
            renderRooms();
            renderRoomDevices();
            renderAllDevices();

            showToast("All devices turned OFF!");
        });

    // ----------------------------------------
    // 18. DARK MODE
    // ----------------------------------------

    const themeBtn = document.getElementById("themeBtn");
    const darkModeSetting = document.getElementById("darkModeSetting");

    function setDarkMode(enabled) {
        document.body.classList.toggle("dark", enabled);

        if (darkModeSetting) {
            darkModeSetting.checked = enabled;
        }

        if (themeBtn) {
            themeBtn.innerHTML = enabled
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';
        }

        localStorage.setItem("smartHomeDarkMode", enabled);
    }

    const savedTheme =
        localStorage.getItem("smartHomeDarkMode") === "true";

    setDarkMode(savedTheme);

    themeBtn?.addEventListener("click", () => {
        setDarkMode(!document.body.classList.contains("dark"));
    });

    darkModeSetting?.addEventListener("change", () => {
        setDarkMode(darkModeSetting.checked);
    });

    // ----------------------------------------
    // 19. NOTIFICATIONS
    // ----------------------------------------

    const notificationBtn = document.getElementById("notificationBtn");
    const notificationPanel = document.getElementById("notificationPanel");

    notificationBtn?.addEventListener("click", () => {
        notificationPanel?.classList.toggle("show");
    });

    document.getElementById("closeNotifications")
        ?.addEventListener("click", () => {
            notificationPanel?.classList.remove("show");
        });

    // ----------------------------------------
    // 20. SECURITY
    // ----------------------------------------
// ----------------------------------------
// 20. ADVANCED SECURITY
// ----------------------------------------

const defaultSecurity = {
    armed: false,
    doorLocked: true,
    windowOpen: false,
    motion: false,
    alarm: false,
    history: []
};

let securityData;

try {
    securityData = JSON.parse(
        localStorage.getItem("smartHomeSecurity")
    ) || { ...defaultSecurity };
} catch {
    securityData = { ...defaultSecurity };
}

securityData = {
    ...defaultSecurity,
    ...securityData,
    history: Array.isArray(securityData.history)
        ? securityData.history
        : []
};

function saveSecurity() {
    localStorage.setItem(
        "smartHomeSecurity",
        JSON.stringify(securityData)
    );
}

function addSecurityHistory(message, type = "info") {
    securityData.history.unshift({
        message,
        type,
        time: new Date().toLocaleString("en-IN")
    });

    securityData.history = securityData.history.slice(0, 30);

    saveSecurity();
    renderSecurity();
}

function renderSecurity() {
    const status = document.getElementById("securityStatus");
    const message = document.getElementById("securityMessage");
    const circle = document.getElementById("securityCircle");
    const securityBtn = document.getElementById("securityBtn");

    if (status) {
        status.textContent = securityData.armed
            ? "Security Armed"
            : "Security Disarmed";
    }

    if (message) {
        message.textContent = securityData.armed
            ? "Your security system is active."
            : "Your security system is currently inactive.";
    }

    if (circle) {
        circle.classList.toggle("warning", securityData.alarm);
        circle.innerHTML = securityData.alarm
            ? '<i class="fa-solid fa-triangle-exclamation"></i>'
            : '<i class="fa-solid fa-shield-halved"></i>';
    }

    if (securityBtn) {
        securityBtn.innerHTML = securityData.armed
            ? '<i class="fa-solid fa-shield"></i> Disarm Security'
            : '<i class="fa-solid fa-shield"></i> Arm Security';
    }

    const doorStatus = document.getElementById("doorStatus");
    const doorBtn = document.getElementById("doorBtn");

    if (doorStatus) {
        doorStatus.textContent = securityData.doorLocked
            ? "Locked"
            : "Unlocked";
    }

    if (doorBtn) {
        doorBtn.textContent = securityData.doorLocked
            ? "Unlock"
            : "Lock";
    }

    const windowStatus = document.getElementById("windowStatus");
    const windowBtn = document.getElementById("windowBtn");

    if (windowStatus) {
        windowStatus.textContent = securityData.windowOpen
            ? "OPEN - Warning"
            : "Closed";
        windowStatus.className = securityData.windowOpen
            ? "status-danger"
            : "status-success";
    }

    if (windowBtn) {
        windowBtn.textContent = securityData.windowOpen
            ? "Close Window"
            : "Simulate Open";
    }

    const motionStatus = document.getElementById("motionStatus");

    if (motionStatus) {
        motionStatus.textContent = securityData.motion
            ? "Motion Detected!"
            : "No Motion";
        motionStatus.className = securityData.motion
            ? "status-danger"
            : "status-success";
    }

    const alarmStatus = document.getElementById("alarmStatus");
    const alarmBtn = document.getElementById("alarmBtn");

    if (alarmStatus) {
        alarmStatus.textContent = securityData.alarm
            ? "ALARM ACTIVE"
            : "Inactive";
        alarmStatus.className = securityData.alarm
            ? "status-danger"
            : "status-success";
    }

    if (alarmBtn) {
        alarmBtn.textContent = securityData.alarm
            ? "Stop Alarm"
            : "Test Alarm";
    }

    const cameraStatus = document.getElementById("cameraStatus");

    if (cameraStatus) {
        cameraStatus.textContent = "Online";
    }

    const history = document.getElementById("securityHistory");

    if (history) {
        if (securityData.history.length === 0) {
            history.innerHTML =
                '<p class="empty-message">No security activity yet.</p>';
        } else {
            history.innerHTML = securityData.history.map(item => `
                <div class="history-item">
                    <div>
                        <strong class="${item.type === "danger"
                            ? "status-danger"
                            : "status-success"}">
                            ${escapeHTML(item.message)}
                        </strong>
                    </div>
                    <small>${escapeHTML(item.time)}</small>
                </div>
            `).join("");
        }
    }
}

// Arm / disarm
document.getElementById("securityBtn")
    ?.addEventListener("click", () => {

        if (!securityData.armed) {
            if (!securityData.doorLocked || securityData.windowOpen) {
                showToast("Lock the door and close the window first!");
                return;
            }

            securityData.armed = true;
            addSecurityHistory("Security system armed", "success");
            showToast("Security system activated!");
        } else {
            securityData.armed = false;
            addSecurityHistory("Security system disarmed", "info");
            showToast("Security system deactivated!");
        }

        saveSecurity();
        renderSecurity();
    });

// Door lock / unlock
document.getElementById("doorBtn")
    ?.addEventListener("click", () => {

        securityData.doorLocked = !securityData.doorLocked;

        const message = securityData.doorLocked
            ? "Main door locked"
            : "Main door unlocked";

        addSecurityHistory(message,
            securityData.doorLocked ? "success" : "danger");

        renderSecurity();
        showToast(message);
    });

// Window sensor simulation
document.getElementById("windowBtn")
    ?.addEventListener("click", () => {

        securityData.windowOpen = !securityData.windowOpen;

        const message = securityData.windowOpen
            ? "Window opened"
            : "Window closed";

        addSecurityHistory(message,
            securityData.windowOpen ? "danger" : "success");

        if (securityData.windowOpen && securityData.armed) {
            securityData.alarm = true;
            addSecurityHistory("ALERT: Window opened while security was armed", "danger");
            showToast("Warning! Security alert!");
        } else {
            showToast(message);
        }

        saveSecurity();
        renderSecurity();
    });

// Motion sensor simulation
document.getElementById("motionBtn")
    ?.addEventListener("click", () => {

        securityData.motion = true;

        addSecurityHistory("Motion detected", "danger");

        if (securityData.armed) {
            securityData.alarm = true;
            addSecurityHistory("ALERT: Motion detected while armed", "danger");
            showToast("Warning! Motion detected!");
        } else {
            showToast("Motion detected!");
        }

        renderSecurity();

        clearTimeout(window.motionResetTimer);

        window.motionResetTimer = setTimeout(() => {
            securityData.motion = false;
            saveSecurity();
            renderSecurity();
        }, 5000);
    });

// Alarm test / stop
document.getElementById("alarmBtn")
    ?.addEventListener("click", () => {

        securityData.alarm = !securityData.alarm;

        addSecurityHistory(
            securityData.alarm
                ? "Alarm activated"
                : "Alarm stopped",
            securityData.alarm ? "danger" : "success"
        );

        renderSecurity();

        showToast(
            securityData.alarm
                ? "Alarm activated!"
                : "Alarm stopped!"
        );
    });

// Camera demo
document.getElementById("cameraBtn")
    ?.addEventListener("click", () => {
        showToast("Security camera is online (demo).");
        addSecurityHistory("Security camera checked", "success");
    });

// Clear history
document.getElementById("clearSecurityHistory")
    ?.addEventListener("click", () => {

        if (!confirm("Clear all security activity history?")) return;

        securityData.history = [];
        saveSecurity();
        renderSecurity();

        showToast("Security history cleared!");
    });

renderSecurity();
// ----------------------------------------
// 20A. FAMILY MEMBER MANAGEMENT
// ----------------------------------------

const defaultFamily = [
    {
        id: 1,
        name: "Home Owner",
        email: "owner@example.com",
        role: "Owner",
        active: true,
        permissions: {
            devices: true,
            security: true,
            members: true
        }
    }
];

let familyMembers;

try {
    familyMembers = JSON.parse(
        localStorage.getItem("smartHomeFamily")
    ) || defaultFamily;
} catch {
    familyMembers = defaultFamily;
}

let editingFamilyId = null;

function saveFamily() {
    localStorage.setItem(
        "smartHomeFamily",
        JSON.stringify(familyMembers)
    );
}

function renderFamily() {
    const list = document.getElementById("familyList");
    const total = document.getElementById("familyCount");
    const active = document.getElementById("activeFamilyCount");

    if (!list) return;

    if (total) {
        total.textContent = familyMembers.length;
    }

    if (active) {
        active.textContent = familyMembers.filter(
            member => member.active
        ).length;
    }

    if (familyMembers.length === 0) {
        list.innerHTML = `
            <p class="empty-message">
                No family members added yet.
            </p>
        `;
        return;
    }

    list.innerHTML = familyMembers.map(member => {
        const permissions = member.permissions || {};

        return `
            <div class="family-card ${member.active ? "" : "member-disabled"}">

                <div class="family-card-top">
                    <div class="family-avatar">
                        ${escapeHTML(member.name.charAt(0).toUpperCase())}
                    </div>

                    <div class="family-details">
                        <h3>${escapeHTML(member.name)}</h3>
                        <p>${escapeHTML(member.email)}</p>
                    </div>
                </div>

                <span class="role-label">
                    ${escapeHTML(member.role)}
                </span>

                <p class="${member.active ? "status-success" : "status-danger"}">
                    ${member.active ? "Active Access" : "Access Disabled"}
                </p>

                <div class="family-permissions">
                    <span>
                        ${permissions.devices ? "✓" : "✗"}
                        Device Control
                    </span>

                    <span>
                        ${permissions.security ? "✓" : "✗"}
                        Security Management
                    </span>

                    <span>
                        ${permissions.members ? "✓" : "✗"}
                        Family Management
                    </span>
                </div>

                ${member.role === "Owner" ? `
                    <p class="owner-note">
                        Owner account cannot be edited or removed.
                    </p>
                ` : `
                    <div class="family-actions">
                        <button data-edit-family="${member.id}">
                            Edit
                        </button>

                        <button data-toggle-family="${member.id}">
                            ${member.active ? "Disable" : "Enable"}
                        </button>

                        <button class="danger-btn"
                                data-delete-family="${member.id}">
                            Remove
                        </button>
                    </div>
                `}

            </div>
        `;
    }).join("");
}

// Open add member modal
document.getElementById("addFamilyBtn")
    ?.addEventListener("click", () => {

        editingFamilyId = null;

        document.getElementById("familyModalTitle").textContent =
            "Add Family Member";

        document.getElementById("familyName").value = "";
        document.getElementById("familyEmail").value = "";
        document.getElementById("familyRole").value = "Member";

        document.getElementById("permissionDevices").checked = true;
        document.getElementById("permissionSecurity").checked = false;
        document.getElementById("permissionMembers").checked = false;

        document.getElementById("saveFamilyBtn").textContent =
            "Save Member";

        document.getElementById("familyModal").classList.remove("hidden");
    });

// Close modal
document.getElementById("closeFamilyBtn")
    ?.addEventListener("click", () => {
        document.getElementById("familyModal").classList.add("hidden");
    });

// Save new member or edit member
document.getElementById("saveFamilyBtn")
    ?.addEventListener("click", () => {

        const name = document.getElementById("familyName").value.trim();
        const email = document.getElementById("familyEmail").value.trim();
        const role = document.getElementById("familyRole").value;

        if (!name || !email) {
            showToast("Please enter name and email!");
            return;
        }

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!emailValid) {
            showToast("Please enter a valid email address!");
            return;
        }

        const duplicate = familyMembers.some(member =>
            member.email.toLowerCase() === email.toLowerCase() &&
            member.id !== editingFamilyId
        );

        if (duplicate) {
            showToast("This email is already registered!");
            return;
        }

        const permissions = {
            devices: document.getElementById("permissionDevices").checked,
            security: document.getElementById("permissionSecurity").checked,
            members: document.getElementById("permissionMembers").checked
        };

        if (editingFamilyId !== null) {
            const member = familyMembers.find(
                item => item.id === editingFamilyId
            );

            if (!member || member.role === "Owner") return;

            member.name = name;
            member.email = email;
            member.role = role;
            member.permissions = permissions;

            showToast("Family member updated!");
        } else {
            familyMembers.push({
                id: Date.now(),
                name,
                email,
                role,
                active: true,
                permissions
            });

            showToast("Family member added!");
        }

        saveFamily();
        renderFamily();

        document.getElementById("familyModal").classList.add("hidden");
        editingFamilyId = null;
    });

// Family member actions
document.getElementById("familyList")
    ?.addEventListener("click", event => {

        const editButton = event.target.closest("[data-edit-family]");
        const toggleButton = event.target.closest("[data-toggle-family]");
        const deleteButton = event.target.closest("[data-delete-family]");

        if (editButton) {
            editingFamilyId = Number(editButton.dataset.editFamily);

            const member = familyMembers.find(
                item => item.id === editingFamilyId
            );

            if (!member || member.role === "Owner") return;

            document.getElementById("familyModalTitle").textContent =
                "Edit Family Member";

            document.getElementById("familyName").value = member.name;
            document.getElementById("familyEmail").value = member.email;
            document.getElementById("familyRole").value = member.role;

            document.getElementById("permissionDevices").checked =
                !!member.permissions?.devices;

            document.getElementById("permissionSecurity").checked =
                !!member.permissions?.security;

            document.getElementById("permissionMembers").checked =
                !!member.permissions?.members;

            document.getElementById("saveFamilyBtn").textContent =
                "Update Member";

            document.getElementById("familyModal").classList.remove("hidden");
            return;
        }

        if (toggleButton) {
            const id = Number(toggleButton.dataset.toggleFamily);

            const member = familyMembers.find(item => item.id === id);

            if (!member || member.role === "Owner") return;

            member.active = !member.active;

            saveFamily();
            renderFamily();

            showToast(
                member.active
                    ? "Member access enabled!"
                    : "Member access disabled!"
            );
            return;
        }

        if (deleteButton) {
            const id = Number(deleteButton.dataset.deleteFamily);

            const member = familyMembers.find(item => item.id === id);

            if (!member || member.role === "Owner") return;

            if (!confirm(`Remove ${member.name} from family members?`)) {
                return;
            }

            familyMembers = familyMembers.filter(item => item.id !== id);

            saveFamily();
            renderFamily();

            showToast("Family member removed!");
        }
    });

saveFamily();
renderFamily();
    // ----------------------------------------
    // 21. DATE AND TIME
    // ----------------------------------------

    function updateDateTime() {

        const dateTime = document.getElementById("dateTime");

        if (dateTime) {
            dateTime.textContent =
                new Date().toLocaleString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 60000);

    // ----------------------------------------
    // 22. AUTOMATION BUTTONS
    // ----------------------------------------

    document.getElementById("addAutomation")
        ?.addEventListener("click", () => {

            const name = prompt("Enter automation name:");

            if (!name || !name.trim()) return;

            const description = prompt(
                "Enter automation description:"
            );

            if (!description || !description.trim()) return;

            const list = document.querySelector(".automation-list");

            const card = document.createElement("div");

            card.className = "automation-card";

            card.innerHTML = `
                <div class="automation-icon">⚙️</div>

                <div class="automation-info">
                    <h3>${escapeHTML(name.trim())}</h3>
                    <p>${escapeHTML(description.trim())}</p>
                </div>

                <label class="switch">
                    <input type="checkbox" checked>
                    <span></span>
                </label>
            `;

            list.appendChild(card);

            showToast("Automation added!");
        });

    // ----------------------------------------
    // 23. INITIALIZE APPLICATION
    // ----------------------------------------

    saveData();

    renderRooms();
    renderDashboard();
    renderAllDevices();

    showSection("dashboard");

});

// ==========================================
// WATER TANK MONITORING SYSTEM
// ==========================================

let waterLevel = Number(
    localStorage.getItem("smartHomeWaterLevel") ?? 500
);

const MAX_WATER = 1000;
let waterMotorOn = false;
let waterMotorInterval = null;

let waterHistory = [];

try {
    waterHistory = JSON.parse(
        localStorage.getItem("smartHomeWaterHistory") || "[]"
    );
    if (!Array.isArray(waterHistory)) waterHistory = [];
} catch {
    waterHistory = [];
}

// Get HTML elements
const waterFill = document.getElementById("waterFill");
const waterPercentage = document.getElementById("waterPercentage");
const waterLevelText = document.getElementById("waterLevelText");
const waterStatus = document.getElementById("waterStatus");
const motorStatus = document.getElementById("motorStatus");
const motorBtn = document.getElementById("motorBtn");
const waterHistoryContainer = document.getElementById("waterHistory");

const addWaterBtn = document.getElementById("addWaterBtn");
const useWaterBtn = document.getElementById("useWaterBtn");
const resetWaterBtn = document.getElementById("resetWaterBtn");

// Save tank level
function saveWaterLevel() {
    localStorage.setItem("smartHomeWaterLevel", waterLevel);
}

// Save activity history
function saveWaterHistory() {
    localStorage.setItem(
        "smartHomeWaterHistory",
        JSON.stringify(waterHistory)
    );
}

// Add history
function addWaterHistory(message) {
    waterHistory.unshift({
        message: message,
        time: new Date().toLocaleString()
    });

    waterHistory = waterHistory.slice(0, 20);

    saveWaterHistory();
    renderWaterHistory();
}

// Display history
function renderWaterHistory() {
    if (!waterHistoryContainer) return;

    if (waterHistory.length === 0) {
        waterHistoryContainer.innerHTML =
            "<p>No water activity yet.</p>";
        return;
    }

    waterHistoryContainer.innerHTML = "";

    waterHistory.forEach(item => {
        const div = document.createElement("div");
        div.className = "water-history-item";

        const strong = document.createElement("strong");
        strong.textContent = item.message;

        const small = document.createElement("small");
        small.textContent = item.time;

        div.append(strong, document.createElement("br"), small);
        waterHistoryContainer.appendChild(div);
    });
}

// Update tank display
function renderWaterTank() {
    const percentage = Math.round(
        (waterLevel / MAX_WATER) * 100
    );

    if (waterFill) {
        waterFill.style.height = percentage + "%";
    }

    if (waterPercentage) {
        waterPercentage.textContent = percentage + "%";
    }

    if (waterLevelText) {
        waterLevelText.textContent = waterLevel + " Litres";
    }

    if (waterStatus) {
        if (waterLevel <= 200) {
            waterStatus.textContent = "⚠ Low Water Level!";
            waterStatus.className = "water-status low";
        } else if (waterLevel <= 500) {
            waterStatus.textContent = "Water Level Medium";
            waterStatus.className = "water-status medium";
        } else {
            waterStatus.textContent = "✓ Normal Water Level";
            waterStatus.className = "water-status";
        }
    }

    if (motorStatus) {
        motorStatus.textContent = waterMotorOn
            ? "Motor ON"
            : "Motor OFF";
    }

    if (motorBtn) {
        motorBtn.textContent = waterMotorOn
            ? "Turn Motor OFF"
            : "Turn Motor ON";
    }
}

// Add water
addWaterBtn?.addEventListener("click", () => {
    if (waterLevel >= MAX_WATER) {
        showToast("Tank is already full!");
        return;
    }

    const previousLevel = waterLevel;
    waterLevel = Math.min(waterLevel + 100, MAX_WATER);

    saveWaterLevel();
    addWaterHistory(
        `${waterLevel - previousLevel} litres of water added`
    );

    renderWaterTank();
    showToast("Water added successfully!");
});

// Use water
useWaterBtn?.addEventListener("click", () => {
    if (waterLevel <= 0) {
        showToast("Tank is empty!");
        return;
    }

    const previousLevel = waterLevel;
    waterLevel = Math.max(waterLevel - 100, 0);

    saveWaterLevel();
    addWaterHistory(
        `${previousLevel - waterLevel} litres of water used`
    );

    renderWaterTank();

    if (waterLevel <= 200) {
        showToast("Warning! Water level is low!");
    } else {
        showToast("Water used successfully!");
    }
});

// Stop motor
function stopWaterMotor() {
    waterMotorOn = false;

    if (waterMotorInterval !== null) {
        clearInterval(waterMotorInterval);
        waterMotorInterval = null;
    }

    renderWaterTank();
}

// Start motor
function startWaterMotor() {
    if (waterLevel >= MAX_WATER) {
        showToast("Tank is already full!");
        return;
    }

    if (waterMotorOn) return;

    waterMotorOn = true;

    renderWaterTank();
    addWaterHistory("Water motor switched ON");
    showToast("Water motor started!");

    waterMotorInterval = setInterval(() => {
        waterLevel = Math.min(waterLevel + 10, MAX_WATER);

        saveWaterLevel();
        renderWaterTank();

        if (waterLevel >= MAX_WATER) {
            stopWaterMotor();

            addWaterHistory(
                "Tank full. Motor switched OFF automatically"
            );

            showToast("Tank is full!");
        }
    }, 1000);
}

// Motor button
motorBtn?.addEventListener("click", () => {
    if (waterMotorOn) {
        stopWaterMotor();
        addWaterHistory("Water motor switched OFF");
        showToast("Motor stopped!");
    } else {
        startWaterMotor();
    }
});

// Reset tank
resetWaterBtn?.addEventListener("click", () => {
    if (!confirm("Reset tank level to 500 litres?")) return;

    stopWaterMotor();

    waterLevel = 500;

    saveWaterLevel();
    addWaterHistory("Tank reset to 500 litres");

    renderWaterTank();
    showToast("Tank reset successfully!");
});

// Initial display
renderWaterTank();
renderWaterHistory();


    
function calculateBill() {

    const device = document.getElementById("billDevice").value;

    const watts = Number(
        document.getElementById("billWatts").value
    );

    const hours = Number(
        document.getElementById("billHours").value
    );

    const rate = Number(
        document.getElementById("billRate").value
    );

    const days = Number(
        document.getElementById("billDays").value
    );

    if (
        !device.trim() ||
        watts <= 0 ||
        hours <= 0 ||
        hours > 24 ||
        rate <= 0 ||
        days <= 0
    ) {
        alert("Please enter valid details!");
        return;
    }

    // Daily electricity consumption
    const dailyUnits = (watts * hours) / 1000;

    // Total electricity consumption
    const totalUnits = dailyUnits * days;

    // Electricity bill
    const totalBill = totalUnits * rate;

    document.getElementById("billResult").innerHTML = `

        <h3>Electricity Bill Details</h3>

        <p>Device: ${escapeBillText(device)}</p>

        <p>Daily Units:
        ${dailyUnits.toFixed(2)} kWh</p>

        <p>Total Units:
        ${totalUnits.toFixed(2)} kWh</p>

        <h2>Estimated Bill: ₹${totalBill.toFixed(2)}</h2>

    `;
}

function escapeBillText(value) {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
}
function getDeviceHistory() {

    try {
        return JSON.parse(
            localStorage.getItem("deviceHistory")
        ) || [];
    } catch (error) {
        return [];
    }
}


// Save device activity
function addDeviceHistory(deviceName, action) {

    const history = getDeviceHistory();

    const record = {
        device: deviceName,
        action: action,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };

    history.unshift(record);

    // Keep only the latest 100 records
    history.splice(100);

    localStorage.setItem(
        "deviceHistory",
        JSON.stringify(history)
    );

    displayDeviceHistory();
}


// Display history
function displayDeviceHistory() {

    const history = getDeviceHistory();

    const historyList =
        document.getElementById("historyList");

    if (!historyList) return;

    if (history.length === 0) {

        historyList.innerHTML =
            "<p>No device activity yet.</p>";

        return;
    }

    historyList.innerHTML = history.map(item => `

        <div class="history-item">

            <h4>🔌 ${escapeBillText(item.device)}</h4>

            <p>
                Status: ${escapeBillText(item.action)}
            </p>

            <small>
                ${escapeBillText(item.date)}
                -
                ${escapeBillText(item.time)}
            </small>

        </div>

    `).join("");
}


// Clear history
function clearDeviceHistory() {

    if (confirm("Are you sure you want to clear history?")) {

        localStorage.removeItem("deviceHistory");

        displayDeviceHistory();

        alert("Device history cleared!");
    }
}
// ========================================
// CONTROL DEVICE BY NAME
// ========================================

function controlDeviceByName(deviceName, status) {

    const devices = document.querySelectorAll(".device-card");

    devices.forEach(device => {

        const name = device.querySelector("h3");

        if (name && name.textContent.trim().toLowerCase() === deviceName.toLowerCase()) {

            const toggle = device.querySelector('input[type="checkbox"]');

            if (toggle) {
                toggle.checked = status;
                toggle.dispatchEvent(new Event("change", { bubbles: true }));
            }

        }

    });

}


// ========================================
// TURN OFF ALL DEVICES
// ========================================

function turnOffAllDevices() {

    const toggles = document.querySelectorAll(
        '.device-card input[type="checkbox"]'
    );

    toggles.forEach(toggle => {

        if (toggle.checked) {
            toggle.checked = false;
            toggle.dispatchEvent(new Event("change", { bubbles: true }));
        }

    });
 
}
