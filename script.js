let selectedVideo = null;
let processedVideo = null;

// DOM Elements
const dropZone = document.getElementById('dropZone');
const videoInput = document.getElementById('videoInput');
const videoInfo = document.getElementById('videoInfo');
const videoPreview = document.getElementById('videoPreview');
const oldMetadata = document.getElementById('oldMetadata');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const downloadSection = document.getElementById('downloadSection');
const downloadBtn = document.getElementById('downloadBtn');

// Drag & Drop Events
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleVideoFile(files[0]);
    }
});

// File Input Event
videoInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleVideoFile(e.target.files[0]);
    }
});

// Handle Video File
function handleVideoFile(file) {
    if (!file.type.startsWith('video/')) {
        alert('Kripya ek valid video file upload karein!');
        return;
    }

    selectedVideo = file;
    
    // Video preview
    const videoUrl = URL.createObjectURL(file);
    videoPreview.src = videoUrl;
    
    // Show video info
    videoInfo.style.display = 'block';
    
    // Display old metadata (mock data)
    displayOldMetadata(file);
    
    // Hide download section
    downloadSection.style.display = 'none';
}

// Display Old Metadata
function displayOldMetadata(file) {
    const metadata = {
        'File Name': file.name,
        'File Size': formatFileSize(file.size),
        'File Type': file.type,
        'Last Modified': file.lastModifiedDate.toLocaleString(),
        'Copyright Info': '© Original Creator (Removed after processing)',
        'Creation Date': 'Available in file metadata',
        'Author': 'Original Author (Will be removed)'
    };

    let html = '<ul class="metadata-list">';
    for (const [key, value] of Object.entries(metadata)) {
        html += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    html += '</ul>';
    
    oldMetadata.innerHTML = html;
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Process Video
async function processVideo() {
    if (!selectedVideo) {
        alert('Pehle video upload karein!');
        return;
    }

    // Show progress
    progressSection.style.display = 'block';
    progressFill.style.width = '0%';
    
    // Simulate processing
    await simulateProcessing();
    
    // Create processed video (copy without metadata)
    processedVideo = new Blob([await selectedVideo.arrayBuffer()], { 
        type: selectedVideo.type 
    });
    
    // Update progress
    progressFill.style.width = '100%';
    progressText.textContent = '✅ Processing Complete!';
    
    // Show download section
    downloadSection.style.display = 'block';
    
    // Set download link
    downloadBtn.onclick = () => {
        downloadProcessedVideo();
    };
}

// Simulate Processing
async function simulateProcessing() {
    const steps = [
        { progress: 20, text: 'Video file read kar rahe hain...' },
        { progress: 40, text: 'Old metadata scan kar rahe hain...' },
        { progress: 60, text: 'Copyright information remove kar rahe hain...' },
        { progress: 80, text: 'Nayi metadata apply kar rahe hain...' },
        { progress: 90, text: 'Video optimize kar rahe hain...' }
    ];

    for (const step of steps) {
        progressFill.style.width = step.progress + '%';
        progressText.textContent = step.text;
        await sleep(800);
    }
}

// Download Processed Video
function downloadProcessedVideo() {
    if (!processedVideo) return;
    
    const url = URL.createObjectURL(processedVideo);
    const a = document.createElement('a');
    a.href = url;
    
    // Get new metadata values
    const newTitle = document.getElementById('newTitle').value || 'video';
    a.download = `${newTitle}_clean.mp4`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✅ Video successfully download ho gayi hai!');
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
         }
