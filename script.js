// Grade Scale
const gradeScale = {
    'S': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6,
    'E': 5,
    'F': 0
};

// Store courses
let courses = [];

// Add a course
function addCourse() {
    const subjectName = document.getElementById('subjectName').value.trim();
    const grade = document.getElementById('grade').value;
    const credits = parseFloat(document.getElementById('credits').value);

    // Validation
    if (!subjectName) {
        alert('Please enter a subject name');
        return;
    }
    if (!grade) {
        alert('Please select a grade');
        return;
    }
    if (!credits || credits <= 0) {
        alert('Please enter valid credits');
        return;
    }

    // Add to courses array
    courses.push({
        name: subjectName,
        grade: grade,
        credits: credits,
        gradePoint: gradeScale[grade]
    });

    // Clear inputs
    document.getElementById('subjectName').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('credits').value = '';

    // Update display
    displayCourses();
    calculateGPA();
}

// Remove a course
function removeCourse(index) {
    courses.splice(index, 1);
    displayCourses();
    calculateGPA();
}

// Display courses
function displayCourses() {
    const coursesList = document.getElementById('coursesList');

    if (courses.length === 0) {
        coursesList.innerHTML = '<p class="empty-message">No courses added yet</p>';
        return;
    }

    let html = '';
    courses.forEach((course, index) => {
        const gradePointStr = course.grade === 'F' ? 'Fail' : course.gradePoint.toFixed(1);
        html += `
            <div class="course-item">
                <div class="course-info">
                    <div class="course-name">${course.name}</div>
                    <div class="course-meta">
                        <span><strong>Grade:</strong> ${course.grade} (${gradePointStr})</span>
                        <span><strong>Credits:</strong> ${course.credits}</span>
                    </div>
                </div>
                <button class="course-remove" onclick="removeCourse(${index})">Remove</button>
            </div>
        `;
    });

    coursesList.innerHTML = html;
}

// Calculate GPA
function calculateGPA() {
    if (courses.length === 0) {
        document.getElementById('currentGPA').textContent = '0.00';
        document.getElementById('totalCredits').textContent = '0';
        document.getElementById('totalCourses').textContent = '0';
        document.getElementById('totalPoints').textContent = '0.00';
        return;
    }

    // Calculate total points and credits
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        totalPoints += course.gradePoint * course.credits;
        totalCredits += course.credits;
    });

    // Calculate GPA
    const gpa = totalPoints / totalCredits;

    // Update display
    document.getElementById('currentGPA').textContent = gpa.toFixed(2);
    document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('totalPoints').textContent = totalPoints.toFixed(2);
}

// Clear all courses
function clearAllCourses() {
    if (courses.length === 0) {
        alert('No courses to clear');
        return;
    }

    if (confirm('Are you sure you want to clear all courses? This action cannot be undone.')) {
        courses = [];
        displayCourses();
        calculateGPA();
        // Clear CGPA results
        document.getElementById('cgpaResult').style.display = 'none';
        document.getElementById('requiredResult').style.display = 'none';
    }
}

// Calculate CGPA
function calculateCGPA() {
    const previousCGPA = parseFloat(document.getElementById('previousCGPA').value);
    const previousCredits = parseFloat(document.getElementById('previousCredits').value);

    // Validation
    if (isNaN(previousCGPA) || previousCGPA < 0 || previousCGPA > 10) {
        alert('Please enter a valid previous CGPA (0-10)');
        return;
    }
    if (isNaN(previousCredits) || previousCredits < 0) {
        alert('Please enter valid previous credits');
        return;
    }
    if (courses.length === 0) {
        alert('Please add courses first');
        return;
    }

    // Calculate current semester GPA
    let currentSemesterPoints = 0;
    let currentSemesterCredits = 0;

    courses.forEach(course => {
        currentSemesterPoints += course.gradePoint * course.credits;
        currentSemesterCredits += course.credits;
    });

    // Calculate new CGPA
    const totalPoints = (previousCGPA * previousCredits) + currentSemesterPoints;
    const totalCredits = previousCredits + currentSemesterCredits;
    const newCGPA = totalPoints / totalCredits;

    // Display result
    document.getElementById('newCGPA').textContent = newCGPA.toFixed(2);
    document.getElementById('cgpaResult').style.display = 'block';

    // Scroll to result
    document.getElementById('cgpaResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Calculate Required GPA
function calculateRequiredGPA() {
    const currentCGPA = parseFloat(document.getElementById('currentCGPA').value);
    const targetCGPA = parseFloat(document.getElementById('targetCGPA').value);
    const currentTotalCredits = parseFloat(document.getElementById('currentTotalCredits').value);

    // Validation
    if (isNaN(currentCGPA) || currentCGPA < 0 || currentCGPA > 10) {
        alert('Please enter a valid current CGPA (0-10)');
        return;
    }
    if (isNaN(targetCGPA) || targetCGPA < 0 || targetCGPA > 10) {
        alert('Please enter a valid target CGPA (0-10)');
        return;
    }
    if (isNaN(currentTotalCredits) || currentTotalCredits < 0) {
        alert('Please enter valid current total credits');
        return;
    }
    if (currentCGPA > targetCGPA) {
        alert('Your current CGPA is already higher than your target CGPA. You can relax!');
        return;
    }
    if (courses.length === 0) {
        alert('Please add courses for the upcoming semester');
        return;
    }

    // Calculate total credits for upcoming courses
    let upcomingCredits = 0;
    courses.forEach(course => {
        upcomingCredits += course.credits;
    });

    // Calculate required GPA
    const currentPoints = currentCGPA * currentTotalCredits;
    const requiredTotalPoints = targetCGPA * (currentTotalCredits + upcomingCredits);
    const requiredPoints = requiredTotalPoints - currentPoints;
    const requiredGPA = requiredPoints / upcomingCredits;

    // Check if achievable
    let requiredGPAValue = requiredGPA.toFixed(2);
    
    if (requiredGPA > 10) {
        requiredGPAValue = '> 10.00 (Not Achievable)';
    } else if (requiredGPA < 0) {
        requiredGPAValue = 'Already Achieved';
    }

    // Display result
    document.getElementById('requiredGPA').textContent = requiredGPAValue;
    document.getElementById('requiredResult').style.display = 'block';

    // Scroll to result
    document.getElementById('requiredResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Allow adding course with Enter key
document.addEventListener('DOMContentLoaded', function() {
    // Add Enter key functionality to credits input
    document.getElementById('credits').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addCourse();
        }
    });

    // Add Enter key functionality to subject name input
    document.getElementById('subjectName').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('grade').focus();
        }
    });

    // Add Enter key functionality to grade select
    document.getElementById('grade').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('credits').focus();
        }
    });

    // Number input constraints
    document.getElementById('credits').addEventListener('input', function() {
        if (this.value && parseFloat(this.value) < 1) this.value = '1';
        if (this.value && parseFloat(this.value) > 10) this.value = '10';
    });

    // CGPA inputs constraints
    document.getElementById('previousCGPA').addEventListener('input', function() {
        if (this.value && parseFloat(this.value) > 10) this.value = '10';
        if (this.value && parseFloat(this.value) < 0) this.value = '0';
    });

    document.getElementById('currentCGPA').addEventListener('input', function() {
        if (this.value && parseFloat(this.value) > 10) this.value = '10';
        if (this.value && parseFloat(this.value) < 0) this.value = '0';
    });

    document.getElementById('targetCGPA').addEventListener('input', function() {
        if (this.value && parseFloat(this.value) > 10) this.value = '10';
        if (this.value && parseFloat(this.value) < 0) this.value = '0';
    });

    // Initialize
    displayCourses();
    calculateGPA();
});
