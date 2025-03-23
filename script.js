document.addEventListener("DOMContentLoaded", () => {
  const seatMap = document.getElementById("seat-map");
  const seats = document.querySelectorAll(".seat");
  const seatDetailsDiv = document.getElementById("seat-details");
  const selectedSeatNumberSpan = document.getElementById(
    "selected-seat-number",
  );
  const passengerNameSpan = document.getElementById("passenger-name");
  const refreshContainer = document.getElementById("refresh-container");
  let selectedSeat = null;

  seats.forEach((seat) => {
    seat.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent click from immediately closing the details

      if (!seat.classList.contains("occupied")) {
        if (selectedSeat === seat) {
          // If the clicked empty seat is already selected
          seat.classList.remove("selected");
          selectedSeat = null;
          seatDetailsDiv.classList.add("hidden");
        } else {
          if (selectedSeat) {
            selectedSeat.classList.remove("selected");
          }
          seat.classList.add("selected");
          selectedSeat = seat;
          // Show details (moved here)
          selectedSeatNumberSpan.textContent = `Asiento: ${selectedSeat.dataset.seat}`;
          passengerNameSpan.textContent = "Libre";
          const seatRect = selectedSeat.getBoundingClientRect();
          seatDetailsDiv.style.top = `${seatRect.top + window.scrollY + seatRect.height + 10}px`;
          seatDetailsDiv.style.left = `${seatRect.left + window.scrollX - seatDetailsDiv.offsetWidth / 2 + seatRect.width / 2}px`;
          seatDetailsDiv.classList.remove("hidden");
        }
      } else {
        // Handling occupied seats
        if (selectedSeat === seat) {
          selectedSeat.classList.remove("selected");
          selectedSeat = null;
          seatDetailsDiv.classList.add("hidden");
        } else {
          if (selectedSeat) {
            selectedSeat.classList.remove("selected");
          }
          selectedSeat = seat;
          selectedSeatNumberSpan.textContent = `Asiento: ${selectedSeat.dataset.seat}`;
          passengerNameSpan.textContent = selectedSeat.dataset.passenger;
          const seatRect = selectedSeat.getBoundingClientRect();
          seatDetailsDiv.style.top = `${seatRect.top + window.scrollY + seatRect.height + 10}px`;
          seatDetailsDiv.style.left = `${seatRect.left + window.scrollX - seatDetailsDiv.offsetWidth / 2 + seatRect.width / 2}px`;
          seatDetailsDiv.classList.remove("hidden");
        }
      }
    });
  });

  // Close details when clicking outside a seat
  seatMap.addEventListener("click", (event) => {
    if (event.target === seatMap) {
      // Check if the click target is the seatMap itself
      if (selectedSeat) {
        selectedSeat.classList.remove("selected");
        selectedSeat = null;
      }
      seatDetailsDiv.classList.add("hidden");
    } else if (!event.target.classList.contains("seat")) {
      // If clicked target is not a seat
      if (selectedSeat && !seatDetailsDiv.contains(event.target)) {
        // And not inside the details window
        selectedSeat.classList.remove("selected");
        selectedSeat = null;
        seatDetailsDiv.classList.add("hidden");
      }
    }
  });

  // Prevent clicks inside the details window from closing it
  seatDetailsDiv.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Pull-to-refresh simulation
  let startY = 0;
  let pulling = false;
  const pullThreshold = 50; // Adjust as needed

  document.addEventListener("touchstart", (e) => {
    if (window.scrollY === 0) {
      // Only allow pull-to-refresh at the top of the page
      startY = e.touches[0].clientY;
      pulling = true;
    }
  });

  document.addEventListener("touchmove", (e) => {
    if (!pulling) return;
    const currentY = e.touches[0].clientY;
    const pullDistance = currentY - startY;

    if (pullDistance > pullThreshold) {
      refreshContainer.classList.add("active");
      pulling = false;
      simulateRefresh();
    } else if (pullDistance < 0) {
      pulling = false; // Stop pulling if the user scrolls up
    }
  });

  document.addEventListener("touchend", () => {
    pulling = false;
  });

  function simulateRefresh() {
    setTimeout(() => {
      refreshContainer.classList.remove("active");
      // In a real application, you would fetch new data here
      console.log("Page Refreshed (Simulated)");
      // For this mockup, we can just log a message
    }, 1500); // Simulate a 1.5-second loading time
  }
});
