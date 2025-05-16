let teams = [
        {
            id: 1,
            name: "Innovators Anonymous",
            project: "Honey Pots Organics", // Project info not provided
            members: "Bongani Mkhize, Joel Dube, Mbali Ngwenya, Reneilwe Kekana, Samukelo Mabika"
        },
        {
            id: 2,
            name: "The Brain Trust",
            project: "Fees App",
            members: "Lenge Dimukayi, Philisiwe Shezi, Alwaba Hlam, Ntshunxeko Nkuna, Itumeleng Mokwena"
        },
        {
            id: 3,
            name: "Visionaries Unleashed",
            project: "iHealth",
            members: "Tlokotse Mogudi, Bridgett Phoshoko, Jack Mazibuko. Kekeletso Nkele, Vincent Mudau"
        },
        {
            id: 4,
            name: "The Ideation Nation",
            project: "The giftBox",
            members: "Xolisile Mtetwa, Patrick Nkonyana, Tshepo Maluleka, Nobuhle"
        },
        {
            id: 5,
            name: "Game Changers",
            project: "Ubuntu SchoolNet",
            members: " Umme-Roomaan Allie, Palesa, Martin, kabelo"
        },
        {
            id: 6,
            name: "Breakthrough Brigade",
            project: "WeWork Logistics Delivery",
            members: "Deandre Marionbok, Siphokazi Simbini, Mathabo Kgatle, Siphelele"
        }
    ];
            
    // Initialize evaluations data
    let evaluations = [];
    
    // Current evaluation
    let currentEvaluation = {
        judge: "",
        teamId: null,
        teamName: "",
        project: "",
        scores: [0, 0, 0, 0],
        total: 0,
        comments: "",
        timestamp: null
    };
    
    // Timer variables
    let timerInterval;
    let timeLeft = 5 * 60; // 5 minutes in seconds
    let isTimerRunning = false;
    
    // Initialize the app
    document.addEventListener('DOMContentLoaded', function() {
        populateTeamDropdown();
        updateProgressBar();
        updateEmojis();
        renderTeamCards();
        
        // Load saved evaluations from localStorage
        const savedEvaluations = localStorage.getItem('hackathonEvaluations');
        if (savedEvaluations) {
            evaluations = JSON.parse(savedEvaluations);
        }
        
        // Load saved teams from localStorage
        const savedTeams = localStorage.getItem('hackathonTeams');
        if (savedTeams) {
            teams = JSON.parse(savedTeams);
            populateTeamDropdown();
            renderTeamCards();
        }
        
        // Check if judge name is saved
        const savedJudge = localStorage.getItem('hackathonJudge');
        if (savedJudge) {
            document.getElementById('judge').value = savedJudge;
            currentEvaluation.judge = savedJudge;
        }
    });
    
    function openTab(tabName) {
        // Hide all tab contents
        const tabContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }
        
        // Remove active class from all tabs
        const tabs = document.getElementsByClassName('tab');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
        }
        
        // Show the selected tab content and mark tab as active
        document.getElementById(tabName).classList.add('active');
        event.currentTarget.classList.add('active');
        
        // If opening results tab, update the results table
        if (tabName === 'results') {
            updateResultsTable();
        } else if (tabName === 'teams') {
            renderTeamCards();
        }
    }
    
    function updateJudgeName() {
        const judgeName = document.getElementById('judge').value.trim();
        currentEvaluation.judge = judgeName;
        localStorage.setItem('hackathonJudge', judgeName);
    }
    
    function populateTeamDropdown() {
        const teamSelect = document.getElementById('team');
        teamSelect.innerHTML = '<option value="">-- Select a team --</option>';
        
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name + " - " + team.project;
            teamSelect.appendChild(option);
        });
    }
    
    function renderTeamCards() {
        const container = document.getElementById('teamsContainer');
        container.innerHTML = '';
        
        if (teams.length === 0) {
            container.innerHTML = '<p>No teams registered yet. Add your first team above!</p>';
            return;
        }
        
        teams.forEach(team => {
            const card = document.createElement('div');
            card.className = 'team-card';
            
            card.innerHTML = `
                <h3>${team.name}</h3>
                <p><strong>Project:</strong> ${team.project}</p>
                <p><strong>Members:</strong> ${team.members}</p>
                <div class="team-actions">
                    <button onclick="editTeam(${team.id})" style="background-color: var(--ocean-blue); color: white;">Edit</button>
                    <button onclick="deleteTeam(${team.id})" style="background-color: var(--danger-red); color: white;">Delete</button>
                </div>
            `;
            
            container.appendChild(card);
        });
    }
    
    function addNewTeam() {
        const name = document.getElementById('newTeamName').value.trim();
        const project = document.getElementById('newProjectName').value.trim();
        const members = document.getElementById('newTeamMembers').value.trim();
        
        if (!name || !project) {
            alert('Please enter both team name and project name');
            return;
        }
        
        const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
        
        teams.push({
            id: newId,
            name: name,
            project: project,
            members: members
        });
        
        // Save to localStorage
        localStorage.setItem('hackathonTeams', JSON.stringify(teams));
        
        // Update UI
        populateTeamDropdown();
        renderTeamCards();
        
        // Clear form
        document.getElementById('newTeamName').value = '';
        document.getElementById('newProjectName').value = '';
        document.getElementById('newTeamMembers').value = '';
        
        // Show confirmation
        alert('Team added successfully!');
    }
    
    function editTeam(teamId) {
        const team = teams.find(t => t.id === teamId);
        if (!team) return;
        
        const newName = prompt("Enter new team name:", team.name);
        if (newName === null) return;
        
        const newProject = prompt("Enter new project name:", team.project);
        if (newProject === null) return;
        
        const newMembers = prompt("Enter team members (comma separated):", team.members);
        
        team.name = newName.trim();
        team.project = newProject.trim();
        team.members = newMembers ? newMembers.trim() : '';
        
        // Save to localStorage
        localStorage.setItem('hackathonTeams', JSON.stringify(teams));
        
        // Update UI
        populateTeamDropdown();
        renderTeamCards();
        
        // Update current evaluation if this is the team being evaluated
        if (currentEvaluation.teamId === teamId) {
            currentEvaluation.teamName = team.name;
            currentEvaluation.project = team.project;
            document.getElementById('project').value = team.project;
        }
    }
    
    function deleteTeam(teamId) {
        if (!confirm('Are you sure you want to delete this team? All evaluations for this team will also be deleted.')) {
            return;
        }
        
        // Remove team
        teams = teams.filter(t => t.id !== teamId);
        
        // Remove evaluations for this team
        evaluations = evaluations.filter(e => e.teamId !== teamId);
        
        // Save to localStorage
        localStorage.setItem('hackathonTeams', JSON.stringify(teams));
        localStorage.setItem('hackathonEvaluations', JSON.stringify(evaluations));
        
        // Update UI
        populateTeamDropdown();
        renderTeamCards();
        
        if (currentEvaluation.teamId === teamId) {
            newTeamEvaluation();
        }
    }
    
    function loadTeamData() {
        const teamId = parseInt(document.getElementById('team').value);
        if (!teamId) {
            document.getElementById('project').value = '';
            currentEvaluation.teamId = null;
            currentEvaluation.teamName = '';
            currentEvaluation.project = '';
            return;
        }
        
        const team = teams.find(t => t.id === teamId);
        if (team) {
            document.getElementById('project').value = team.project;
            currentEvaluation.teamId = team.id;
            currentEvaluation.teamName = team.name;
            currentEvaluation.project = team.project;
            
            // Check if this judge has already evaluated this team
            const judgeName = document.getElementById('judge').value.trim();
            if (judgeName) {
                const existingEval = evaluations.find(e => 
                    e.judge === judgeName && e.teamId === team.id
                );
                
                if (existingEval) {
                    if (confirm('You have already evaluated this team. Load your previous evaluation?')) {
                        loadEvaluation(existingEval);
                    }
                }
            }
        }
    }
    
    function loadEvaluation(eval) {
        // Load scores
        for (let i = 0; i < 4; i++) {
            document.querySelectorAll('#scoreTable input[type="number"]')[i].value = eval.scores[i];
            currentEvaluation.scores[i] = eval.scores[i];
        }
        
        // Load comments
        document.getElementById('comments').value = eval.comments;
        currentEvaluation.comments = eval.comments;
        
        // Update total
        updateTotalScore();
        updateEmojis();
        updateProgressBar();
    }
    
    function setScore(criteriaNum, value) {
        const input = document.querySelectorAll('#scoreTable input[type="number"]')[criteriaNum-1];
        input.value = value;
        updateScore(criteriaNum, value);
    }
    
    function updateScore(criteriaNum, value) {
        // Validate input
        value = Math.min(5, Math.max(0, parseInt(value) || 0));
        
        // Update current evaluation
        currentEvaluation.scores[criteriaNum - 1] = value;
        
        // Update total
        updateTotalScore();
        
        // Update emoji
        updateEmojis();
        
        // Update progress bar
        updateProgressBar();
    }
    
    function updateTotalScore() {
        const total = currentEvaluation.scores.reduce((sum, score) => sum + score, 0);
        document.getElementById('totalScore').textContent = total;
        currentEvaluation.total = total;
    }
    
    function updateProgressBar() {
        const inputs = document.querySelectorAll('#scoreTable input[type="number"]');
        let filled = 0;
        
        inputs.forEach(input => {
            if (input.value && parseInt(input.value) > 0) {
                filled++;
            }
        });
        
        const percent = (filled / inputs.length) * 100;
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = percent + '%';
        progressBar.textContent = Math.round(percent) + '%';
        
        // Change color based on completion
        if (percent < 30) {
            progressBar.style.background = 'linear-gradient(90deg, #ff6b6b, #ff8e8e)';
        } else if (percent < 70) {
            progressBar.style.background = 'linear-gradient(90deg, #ffd166, #ffdf85)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, var(--seafoam), var(--ocean-blue))';
        }
    }
    
    function updateEmojis() {
        const emojis = ["🤔", "😐", "🙂", "😃", "🤩", "🔥"];
        const emojiElements = [
            document.getElementById('emoji1'),
            document.getElementById('emoji2'),
            document.getElementById('emoji3'),
            document.getElementById('emoji4')
        ];
        
        for (let i = 0; i < 4; i++) {
            const score = currentEvaluation.scores[i] || 0;
            let emojiIndex = Math.floor(score);
            if (emojiIndex >= emojis.length) emojiIndex = emojis.length - 1;
            emojiElements[i].textContent = emojis[emojiIndex];
        }
    }
    
    function saveEvaluation() {
        // Validate judge name
        currentEvaluation.judge = document.getElementById('judge').value.trim();
        if (!currentEvaluation.judge) {
            alert('Please enter your name');
            return;
        }
        
        // Validate team selection
        if (!currentEvaluation.teamId) {
            alert('Please select a team');
            return;
        }
        
        // Validate at least one score is entered
        if (currentEvaluation.total === 0) {
            if (!confirm('You haven\'t entered any scores. Save evaluation with 0 points?')) {
                return;
            }
        }
        
        // Get comments
        currentEvaluation.comments = document.getElementById('comments').value.trim();
        
        // Add timestamp
        currentEvaluation.timestamp = new Date().toISOString();
        
        // Check if this judge has already evaluated this team
        const existingIndex = evaluations.findIndex(e => 
            e.judge === currentEvaluation.judge && e.teamId === currentEvaluation.teamId
        );
        
        if (existingIndex >= 0) {
            // Update existing evaluation
            evaluations[existingIndex] = {...currentEvaluation};
        } else {
            // Add new evaluation
            evaluations.push({...currentEvaluation});
        }
        
        // Save to localStorage
        localStorage.setItem('hackathonEvaluations', JSON.stringify(evaluations));
        
        // Show confirmation
        createConfetti();
        alert(`Evaluation saved for ${currentEvaluation.teamName}!\nTotal score: ${currentEvaluation.total}/20`);
    }
    
    function newTeamEvaluation() {
        // Reset form
        document.getElementById('team').value = '';
        document.getElementById('project').value = '';
        document.getElementById('comments').value = '';
        
        // Reset scores
        const inputs = document.querySelectorAll('#scoreTable input[type="number"]');
        inputs.forEach(input => {
            input.value = '0';
        });
        
        // Reset current evaluation
        currentEvaluation = {
            judge: document.getElementById('judge').value.trim(),
            teamId: null,
            teamName: "",
            project: "",
            scores: [0, 0, 0, 0],
            total: 0,
            comments: "",
            timestamp: null
        };
        
        // Update UI
        updateTotalScore();
        updateEmojis();
        updateProgressBar();
    }
    
    function exportToExcel() {
        // Validate there's data to export
        if (!currentEvaluation.teamId) {
            alert('Please select a team and enter evaluation data first');
            return;
        }
        
        // Create Excel workbook
        const wb = XLSX.utils.book_new();
        
        // Prepare data
        const data = [
            ["Shark Tank Hackathon Evaluation"],
            ["Judge:", currentEvaluation.judge || ''],
            ["Team:", currentEvaluation.teamName || ''],
            ["Project:", currentEvaluation.project || ''],
            ["Date:", new Date().toLocaleString()],
            [],
            ["Criteria", "Score (0-5)"],
            ["1. Innovation & Creativity", currentEvaluation.scores[0]],
            ["2. Problem-Solution Fit", currentEvaluation.scores[1]],
            ["3. Business Model & Scalability", currentEvaluation.scores[2]],
            ["4. Presentation & Pitch Delivery", currentEvaluation.scores[3]],
            ["TOTAL SCORE", currentEvaluation.total + " / 20"],
            [],
            ["Comments & Feedback:"],
            [currentEvaluation.comments || 'No comments provided']
        ];
        
        // Convert to worksheet
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Evaluation");
        
        // Generate file and download
        XLSX.writeFile(wb, `SharkTank_Evaluation_${currentEvaluation.teamName.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
    }
    
    function generatePDF() {
        // Validate there's data to export
        if (!currentEvaluation.teamId) {
            alert('Please select a team and enter evaluation data first');
            return;
        }
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.setTextColor(0, 119, 190); // Ocean blue
        doc.text('Shark Tank Hackathon Evaluation', 105, 15, { align: 'center' });
        
        // Add shark icon
        doc.setFontSize(40);
        doc.text('🦈', 20, 25);
        doc.text('🦈', 180, 25);
        
        // Add judge and team info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        let y = 40;
        doc.text(`Judge: ${currentEvaluation.judge || 'Not specified'}`, 20, y);
        y += 10;
        doc.text(`Team: ${currentEvaluation.teamName || 'Not specified'}`, 20, y);
        y += 10;
        doc.text(`Project: ${currentEvaluation.project || 'Not specified'}`, 20, y);
        y += 10;
        doc.text(`Date: ${new Date().toLocaleString()}`, 20, y);
        y += 15;
        
        // Add scores table
        doc.setFontSize(14);
        doc.setTextColor(0, 119, 190);
        doc.text('Evaluation Scores', 20, y);
        y += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // Table headers
        doc.setFillColor(74, 74, 74); // Shark gray
        doc.setTextColor(255, 255, 255);
        doc.rect(20, y, 170, 10, 'F');
        doc.text('Criteria', 25, y + 7);
        doc.text('Score', 180, y + 7, { align: 'right' });
        y += 10;
        
        // Table rows
        doc.setTextColor(0, 0, 0);
        const criteria = [
            '1. Innovation & Creativity',
            '2. Problem-Solution Fit',
            '3. Business Model & Scalability',
            '4. Presentation & Pitch Delivery'
        ];
        
        criteria.forEach((crit, index) => {
            doc.text(crit, 25, y + 7);
            doc.text(currentEvaluation.scores[index].toString(), 180, y + 7, { align: 'right' });
            y += 10;
        });
        
        // Total row
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL SCORE', 25, y + 7);
        doc.text(`${currentEvaluation.total} / 20`, 180, y + 7, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        y += 15;
        
        // Add comments
        doc.setFontSize(14);
        doc.setTextColor(0, 119, 190);
        doc.text('Comments & Feedback:', 20, y);
        y += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        const comments = currentEvaluation.comments || 'No comments provided';
        const splitComments = doc.splitTextToSize(comments, 170);
        doc.text(splitComments, 20, y);
        
        // Save the PDF
        doc.save(`SharkTank_Evaluation_${currentEvaluation.teamName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    }
    
    function updateResultsTable() {
        const tableBody = document.querySelector('#resultsTable tbody');
        tableBody.innerHTML = '';
        
        if (evaluations.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No evaluations yet. Start judging teams!</td></tr>';
            return;
        }
        
        // Group evaluations by team and calculate averages
        const teamResults = {};
        
        evaluations.forEach(eval => {
            if (!teamResults[eval.teamId]) {
                const team = teams.find(t => t.id === eval.teamId);
                if (!team) return;
                
                teamResults[eval.teamId] = {
                    name: team.name,
                    project: team.project,
                    evaluations: [],
                    totalScore: 0
                };
            }
            
            teamResults[eval.teamId].evaluations.push(eval);
            teamResults[eval.teamId].totalScore += eval.total;
        });
        
        // Convert to array and calculate averages
        const results = Object.keys(teamResults).map(teamId => {
            const team = teamResults[teamId];
            return {
                teamId: parseInt(teamId),
                name: team.name,
                project: team.project,
                evaluationCount: team.evaluations.length,
                averageScore: team.totalScore / team.evaluations.length
            };
        });
        
        // Sort by average score (descending)
        results.sort((a, b) => b.averageScore - a.averageScore);
        
        // Display results
        results.forEach((result, index) => {
            const row = document.createElement('tr');
            
            // Highlight winner
            const isWinner = index === 0 && results.length > 1;
            
            row.innerHTML = `
                <td>${index + 1} ${isWinner ? '<span class="winner-badge">WINNER</span>' : ''}</td>
                <td>${result.name}</td>
                <td>${result.project}</td>
                <td>${result.averageScore.toFixed(1)}</td>
                <td>${result.evaluationCount}</td>
                <td><button onclick="showTeamDetails(${result.teamId})" style="background-color: var(--ocean-blue); color: white; padding: 5px 10px; border: none; border-radius: 4px;">Details</button></td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Update chart
        updateResultsChart(results);
    }
    
    function updateResultsChart(results) {
        const ctx = document.getElementById('resultsChart').getContext('2d');
        
        // Sort results by team name for the chart
        const sortedResults = [...results].sort((a, b) => a.name.localeCompare(b.name));
        
        // Destroy previous chart if it exists
        if (window.resultsChart) {
            window.resultsChart.destroy();
        }
        
        window.resultsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedResults.map(r => r.name),
                datasets: [{
                    label: 'Average Score',
                    data: sortedResults.map(r => r.averageScore),
                    backgroundColor: 'rgba(0, 119, 190, 0.7)',
                    borderColor: 'rgba(0, 119, 190, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 20,
                        title: {
                            display: true,
                            text: 'Average Score (0-20)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Team Name'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Team Performance Comparison',
                        font: {
                            size: 18
                        }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const team = sortedResults[context.dataIndex];
                                return `Project: ${team.project}\nEvaluations: ${team.evaluationCount}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function showTeamDetails(teamId) {
        const team = teams.find(t => t.id === teamId);
        if (!team) return;
        
        // Set team info
        document.getElementById('modalTeamName').textContent = team.name;
        document.getElementById('modalProjectName').textContent = team.project;
        document.getElementById('modalTeamMembers').textContent = team.members;
        
        // Get evaluations for this team
        const teamEvaluations = evaluations.filter(e => e.teamId === teamId);
        
        const evaluationsContainer = document.getElementById('modalEvaluations');
        evaluationsContainer.innerHTML = '';
        
        if (teamEvaluations.length === 0) {
            evaluationsContainer.innerHTML = '<p>No evaluations yet for this team.</p>';
        } else {
            // Calculate average score
            const avgScore = teamEvaluations.reduce((sum, eval) => sum + eval.total, 0) / teamEvaluations.length;
            
            evaluationsContainer.innerHTML += `
                <p><strong>Average Score:</strong> ${avgScore.toFixed(1)} / 20 (from ${teamEvaluations.length} evaluation${teamEvaluations.length !== 1 ? 's' : ''})</p>
            `;
            
            // Add each evaluation
            teamEvaluations.forEach((eval, index) => {
                const evalDiv = document.createElement('div');
                evalDiv.className = 'team-card';
                evalDiv.style.marginTop = '15px';
                
                evalDiv.innerHTML = `
                    <h4>Evaluation #${index + 1} by ${eval.judge}</h4>
                    <p><strong>Date:</strong> ${new Date(eval.timestamp).toLocaleString()}</p>
                    <p><strong>Total Score:</strong> ${eval.total} / 20</p>
                    <p><strong>Scores:</strong> 
                        Innovation (${eval.scores[0]}), 
                        Problem-Solution (${eval.scores[1]}), 
                        Business Model (${eval.scores[2]}), 
                        Presentation (${eval.scores[3]})
                    </p>
                    <p><strong>Comments:</strong> ${eval.comments || 'No comments'}</p>
                `;
                
                evaluationsContainer.appendChild(evalDiv);
            });
        }
        
        // Show modal
        document.getElementById('teamDetailsModal').style.display = 'block';
    }
    
    function closeModal() {
        document.getElementById('teamDetailsModal').style.display = 'none';
    }
    
    function exportAllToExcel() {
        if (evaluations.length === 0) {
            alert('No evaluations to export');
            return;
        }
        
        // Create Excel workbook
        const wb = XLSX.utils.book_new();
        
        // Prepare teams data
        const teamsData = [
            ["Team Name", "Project Name", "Members"],
            ...teams.map(team => [team.name, team.project, team.members])
        ];
        
        // Prepare evaluations data
        const evaluationsData = [
            ["Judge", "Team", "Project", "Innovation", "Problem-Solution", "Business Model", "Presentation", "Total Score", "Comments", "Date"],
            ...evaluations.map(eval => {
                const team = teams.find(t => t.id === eval.teamId) || {};
                return [
                    eval.judge,
                    team.name || '',
                    team.project || '',
                    eval.scores[0],
                    eval.scores[1],
                    eval.scores[2],
                    eval.scores[3],
                    eval.total,
                    eval.comments,
                    new Date(eval.timestamp).toLocaleString()
                ];
            })
        ];
        
        // Convert to worksheets
        const teamsWs = XLSX.utils.aoa_to_sheet(teamsData);
        const evaluationsWs = XLSX.utils.aoa_to_sheet(evaluationsData);
        
        // Add worksheets to workbook
        XLSX.utils.book_append_sheet(wb, teamsWs, "Teams");
        XLSX.utils.book_append_sheet(wb, evaluationsWs, "Evaluations");
        
        // Generate file and download
        XLSX.writeFile(wb, "SharkTank_Hackathon_All_Data.xlsx");
    }
    
    function generateSummaryPDF() {
        if (evaluations.length === 0) {
            alert('No evaluations to generate summary');
            return;
        }
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.setTextColor(0, 119, 190);
        doc.text('Shark Tank Hackathon - Results Summary', 105, 15, { align: 'center' });
        
        // Add shark icon
        doc.setFontSize(40);
        doc.text('🦈', 20, 25);
        doc.text('🦈', 180, 25);
        
        // Add date
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
        
        // Group evaluations by team and calculate averages
        const teamResults = {};
        
        evaluations.forEach(eval => {
            if (!teamResults[eval.teamId]) {
                const team = teams.find(t => t.id === eval.teamId);
                if (!team) return;
                
                teamResults[eval.teamId] = {
                    name: team.name,
                    project: team.project,
                    evaluations: [],
                    totalScore: 0
                };
            }
            
            teamResults[eval.teamId].evaluations.push(eval);
            teamResults[eval.teamId].totalScore += eval.total;
        });
        
        // Convert to array and calculate averages
        const results = Object.keys(teamResults).map(teamId => {
            const team = teamResults[teamId];
            return {
                teamId: parseInt(teamId),
                name: team.name,
                project: team.project,
                evaluationCount: team.evaluations.length,
                averageScore: team.totalScore / team.evaluations.length
            };
        });
        
        // Sort by average score (descending)
        results.sort((a, b) => b.averageScore - a.averageScore);
        
        let y = 45;
        
        // Add summary table
        doc.setFontSize(14);
        doc.setTextColor(0, 119, 190);
        doc.text('Team Rankings', 20, y);
        y += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // Table headers
        doc.setFillColor(74, 74, 74);
        doc.setTextColor(255, 255, 255);
        doc.rect(20, y, 170, 10, 'F');
        doc.text('Rank', 25, y + 7);
        doc.text('Team', 50, y + 7);
        doc.text('Project', 100, y + 7);
        doc.text('Avg Score', 160, y + 7, { align: 'right' });
        y += 10;
        
        // Table rows
        doc.setTextColor(0, 0, 0);
        results.forEach((result, index) => {
            // Highlight winner
            if (index === 0 && results.length > 1) {
                doc.setFillColor(255, 215, 0); // Gold for winner
                doc.rect(20, y, 170, 10, 'F');
                doc.setTextColor(0, 0, 0);
            }
            
            doc.text((index + 1).toString(), 25, y + 7);
            doc.text(result.name, 50, y + 7);
            doc.text(result.project, 100, y + 7);
            doc.text(result.averageScore.toFixed(1), 160, y + 7, { align: 'right' });
            
            // Reset styles
            doc.setFillColor(255, 255, 255);
            doc.setTextColor(0, 0, 0);
            
            y += 10;
            
            // Add new page if needed
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
        
        y += 15;
        
        // Add evaluations count
        doc.setFontSize(14);
        doc.setTextColor(0, 119, 190);
        doc.text('Summary Statistics', 20, y);
        y += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        const totalEvaluations = evaluations.length;
        const totalTeams = results.length;
        const highestScore = Math.max(...evaluations.map(e => e.total));
        const lowestScore = Math.min(...evaluations.map(e => e.total));
        const avgScore = evaluations.reduce((sum, eval) => sum + eval.total, 0) / totalEvaluations;
        
        doc.text(`Total Teams: ${totalTeams}`, 20, y);
        y += 10;
        doc.text(`Total Evaluations: ${totalEvaluations}`, 20, y);
        y += 10;
        doc.text(`Highest Score: ${highestScore}/20`, 20, y);
        y += 10;
        doc.text(`Lowest Score: ${lowestScore}/20`, 20, y);
        y += 10;
        doc.text(`Average Score: ${avgScore.toFixed(1)}/20`, 20, y);
        y += 15;
        
        // Save the PDF
        doc.save('SharkTank_Hackathon_Summary.pdf');
    }
    
    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Timer functions
    function startTimer() {
        if (isTimerRunning) return;
        
        isTimerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    function pauseTimer() {
        isTimerRunning = false;
        clearInterval(timerInterval);
    }
    
    function resetTimer() {
        pauseTimer();
        timeLeft = 15 * 60; // Reset to 5 minutes
        updateTimerDisplay();
    }
    
    function updateTimer() {
        if (timeLeft <= 0) {
            pauseTimer();
            createConfetti();
            alert("Time's up! Pitch completed.");
            return;
        }
        
        timeLeft--;
        updateTimerDisplay();
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timerDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress bar
        const percent = (timeLeft / (15 * 60)) * 100;
        document.getElementById('timerProgressBar').style.width = percent + '%';
        
        // Change color based on time left
        if (percent < 20) {
            document.getElementById('timerProgressBar').style.background = 'linear-gradient(90deg, #ff6b6b, #ff8e8e)';
        } else if (percent < 50) {
            document.getElementById('timerProgressBar').style.background = 'linear-gradient(90deg, #ffd166, #ffdf85)';
        } else {
            document.getElementById('timerProgressBar').style.background = 'linear-gradient(90deg, var(--seafoam), var(--ocean-blue))';
        }
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === document.getElementById('teamDetailsModal')) {
            closeModal();
        }
    };
//===================================================================================================================================================================================================



