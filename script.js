// --- Date Display Script ---
const currentDateElement = document.getElementById('currentDate');

// Function to get and format the current date
function displayCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Month is 0-indexed
    const day = now.getDate();
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[now.getDay()];

    const formattedDate = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
    currentDateElement.textContent = formattedDate;
}

// Call the function to display the date on load
displayCurrentDate();


// --- Task List Script ---
// Get references to HTML elements
const taskTime = document.getElementById('taskTime');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Function to add a new task
function addTask() {
    const timeValue = taskTime.value;
    const taskText = taskInput.value.trim();

    // Only add if task input is not empty
    if (taskText !== '') {
        // Create a new list item (li) for the task
        const li = document.createElement('li');
        li.classList.add('task-item');

        // Create a container for time and task text
        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');

        // Create a span for the time
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('task-time');
        timeSpan.textContent = timeValue ? timeValue : '시간 없음';

        // Create a span for the task text
        const taskSpan = document.createElement('span');
        taskSpan.classList.add('task-text');
        taskSpan.textContent = taskText;

        // Create a container for action buttons
        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.classList.add('action-btn', 'edit-btn');
        editBtn.textContent = '수정';

        // Create check button
        const checkBtn = document.createElement('button');
        checkBtn.classList.add('action-btn', 'check-btn');
        checkBtn.textContent = '체크';

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('action-btn', 'delete-btn');
        deleteBtn.textContent = '삭제';

        // Append time and task text to the content container
        taskContent.appendChild(timeSpan);
        taskContent.appendChild(taskSpan);

        // Append action buttons to the actions container
        taskActions.appendChild(editBtn);
        taskActions.appendChild(checkBtn);
        taskActions.appendChild(deleteBtn);

        // Append the content container and actions container to the list item
        li.appendChild(taskContent);
        li.appendChild(taskActions);

        // Append the new list item to the task list (ul)
        taskList.appendChild(li);

        // Clear the input fields
        taskTime.value = '';
        taskInput.value = '';

        // Add event listener to mark task as complete/incomplete by clicking task content
        taskContent.addEventListener('click', function() {
            li.classList.toggle('completed');
        });

         // Add event listener to mark task as complete/incomplete by clicking check button
        checkBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent click from triggering taskContent click
            li.classList.toggle('completed');
        });


        // Add event listener to delete the task
        deleteBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent click from triggering taskContent click
            taskList.removeChild(li);
        });

        // Add event listener for the edit button
        editBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent click from triggering taskContent click
            enterTaskEditMode(li, timeSpan, taskSpan); // Enter edit mode for this item
        });
    }
}

// Function to enter edit mode for a task item
function enterTaskEditMode(li, timeSpan, taskSpan) {
    // Add a class to the list item to indicate edit mode
    li.classList.add('edit-mode');

    // Create input fields for editing
    const editInputArea = document.createElement('div');
    editInputArea.classList.add('edit-input-area');

    const editTimeInput = document.createElement('input');
    editTimeInput.type = 'time';
    editTimeInput.value = timeSpan.textContent === '시간 없음' ? '' : timeSpan.textContent; // Populate with current time
    editTimeInput.classList.add('flex-grow'); // Use flex-grow for responsiveness

    const editTaskInput = document.createElement('input');
    editTaskInput.type = 'text';
    editTaskInput.value = taskSpan.textContent; // Populate with current task text
    editTaskInput.classList.add('flex-grow'); // Use flex-grow for responsiveness

    // Create a save button
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('action-btn', 'save-btn');
    saveBtn.textContent = '저장';

    // Append input fields and save button to the edit area
    editInputArea.appendChild(editTimeInput);
    editInputArea.appendChild(editTaskInput);
    editInputArea.appendChild(saveBtn);

    // Insert the edit area before the task actions (which are hidden in edit mode)
    li.insertBefore(editInputArea, li.querySelector('.task-actions'));

    // Focus on the task input field for immediate editing
    editTaskInput.focus();

    // Function to exit edit mode and save changes for task
    function exitTaskEditMode() {
        // Update the spans with the new values
        timeSpan.textContent = editTimeInput.value ? editTimeInput.value : '시간 없음';
        taskSpan.textContent = editTaskInput.value.trim();

        // Remove the edit mode class
        li.classList.remove('edit-mode');

        // Remove the edit input area
        li.removeChild(editInputArea);
    }

    // Add event listener to the save button
    saveBtn.addEventListener('click', exitTaskEditMode);

    // Allow saving by pressing Enter key in the input fields
    editTaskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            exitTaskEditMode();
        }
    });
     editTimeInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            exitTaskEditMode();
        }
    });
}


// Add event listener to the 'Add' button
addTaskBtn.addEventListener('click', addTask);

// Allow adding task by pressing Enter key in the task input field
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

 // Optional: Allow adding task by pressing Enter key in the time input field
taskTime.addEventListener('keypress', function(event) {
     if (event.key === 'Enter') {
         addTask();
     }
});


// --- Daily Feedback Script ---
const feedbackSection = document.querySelector('.feedback-section'); // Get the feedback section element
const feedbackTextarea = document.getElementById('feedbackTextarea');
const saveFeedbackBtn = document.getElementById('saveFeedbackBtn');
const feedbackInputArea = document.getElementById('feedbackInputArea');
const feedbackDisplayArea = document.getElementById('feedbackDisplayArea');
const savedFeedbackText = document.getElementById('savedFeedbackText');
const editFeedbackBtn = document.getElementById('editFeedbackBtn');
const deleteFeedbackBtn = document.getElementById('deleteFeedbackBtn');
const cancelFeedbackEditBtn = document.getElementById('cancelFeedbackEditBtn');

// Key for storing feedback in localStorage
const FEEDBACK_STORAGE_KEY = 'dailyFeedback';

// Function to save feedback
function saveFeedback() {
    const feedback = feedbackTextarea.value.trim();
    if (feedback !== '') {
        // Save feedback to localStorage
        localStorage.setItem(FEEDBACK_STORAGE_KEY, feedback);
        displayFeedback(feedback); // Display the saved feedback
    } else {
        // If feedback is empty, remove from storage and hide display
         localStorage.removeItem(FEEDBACK_STORAGE_KEY);
         hideFeedbackDisplay();
    }
}

// Function to display feedback
function displayFeedback(feedback) {
    savedFeedbackText.textContent = feedback; // Set the text content
    feedbackInputArea.classList.add('hidden'); // Hide input area
    feedbackDisplayArea.classList.remove('hidden'); // Show display area
    // Ensure feedback section is not in edit mode
    feedbackSection.classList.remove('feedback-edit-mode');
}

// Function to hide feedback display and show input area
function hideFeedbackDisplay() {
     feedbackInputArea.classList.remove('hidden'); // Show input area
     feedbackDisplayArea.classList.add('hidden'); // Hide display area
     feedbackTextarea.value = ''; // Clear textarea when switching back
     // Ensure feedback section is not in edit mode
     feedbackSection.classList.remove('feedback-edit-mode');
     // Hide cancel button when not in edit mode
     cancelFeedbackEditBtn.classList.add('hidden');
}


// Function to load feedback from localStorage on page load
function loadFeedback() {
    const saved = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (saved) {
        displayFeedback(saved); // If feedback exists, display it
    } else {
        hideFeedbackDisplay(); // If no feedback, show input area
    }
}

// Function to enter feedback edit mode
function enterFeedbackEditMode() {
     const currentFeedback = savedFeedbackText.textContent;
     feedbackTextarea.value = currentFeedback; // Put current feedback into textarea
     feedbackSection.classList.add('feedback-edit-mode'); // Add class to show input area and hide display
     feedbackTextarea.focus(); // Focus on the textarea
     cancelFeedbackEditBtn.classList.remove('hidden'); // Show cancel button
}

// Function to exit feedback edit mode (used by cancel button)
function cancelFeedbackEdit() {
    const saved = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (saved) {
        displayFeedback(saved); // Revert to displaying saved feedback
    } else {
        hideFeedbackDisplay(); // If no saved feedback, go back to empty input
    }
}

// Function to delete feedback
function deleteFeedback() {
     localStorage.removeItem(FEEDBACK_STORAGE_KEY); // Remove from storage
     hideFeedbackDisplay(); // Hide display and show empty input
}


// Add event listener to the Save Feedback button
saveFeedbackBtn.addEventListener('click', saveFeedback);

// Add event listener to the Edit Feedback button
editFeedbackBtn.addEventListener('click', enterFeedbackEditMode);

// Add event listener to the Delete Feedback button
deleteFeedbackBtn.addEventListener('click', deleteFeedback);

// Add event listener to the Cancel Feedback Edit button
cancelFeedbackEditBtn.addEventListener('click', cancelFeedbackEdit);


// Load feedback when the page finishes loading
window.addEventListener('load', loadFeedback);
