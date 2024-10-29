function fifoPageReplacement(pages, capacity) {
    let memory = [];     // Array to simulate memory (holds pages)
    let pageFaults = 0;  // Counter for page faults
    let index = 0;       // Index to keep track of FIFO order

    // Traverse the pages requested
    pages.forEach(page => {
        // If page is not in memory
        if (!memory.includes(page)) {
            pageFaults++;

            // If memory has space, add the new page
            if (memory.length < capacity) {
                memory.push(page);
            } else {
                // Memory is full, replace the oldest page (FIFO)
                memory[index] = page;
                index = (index + 1) % capacity; // Move index to next page in FIFO
            }
        }

        // Log the current state of memory
        console.log(`Page ${page} -> Memory: [${memory.join(", ")}]`);
    });

    // Return the total number of page faults
    return pageFaults;
}


function lruPageReplacement(pages, capacity) {
    let memory = [];     // Array to simulate memory (holds pages)
    let pageFaults = 0;  // Counter for page faults
    let lruMap = new Map(); // Map to track the usage of pages

    pages.forEach((page, i) => {
        // If page is not in memory
        if (!memory.includes(page)) {
            pageFaults++;

            // If memory has space, add the new page
            if (memory.length < capacity) {
                memory.push(page);
            } else {
                // Memory is full, replace the least recently used page
                let lruPage = getLRUPage(lruMap, memory);
                let index = memory.indexOf(lruPage);
                memory[index] = page;  // Replace the LRU page with the new one
            }
        }

        // Update the page usage in the LRU map (mark as most recently used)
        lruMap.set(page, i);

        // Log the current state of memory
        console.log(`Page ${page} -> Memory: [${memory.join(", ")}]`);
    });

    // Return the total number of page faults
    return pageFaults;
}

// Helper function to get the least recently used page
function getLRUPage(lruMap, memory) {
    let lruPage = null;
    let oldestUse = Infinity;

    for (let page of memory) {
        if (lruMap.get(page) < oldestUse) {
            oldestUse = lruMap.get(page);
            lruPage = page;
        }
    }
    
    return lruPage;
}


function optPageReplacement(pages, capacity) {
    let memory = [];     // Array to simulate memory (holds pages)
    let pageFaults = 0;  // Counter for page faults

    // Traverse the page reference sequence
    pages.forEach((page, i) => {
        // If the page is not in memory
        if (!memory.includes(page)) {
            pageFaults++;

            // If there is space in memory, add the page
            if (memory.length < capacity) {
                memory.push(page);
            } else {
                // Memory is full, replace the page that is not used for the longest period
                let pageToReplace = getOptimalPage(memory, pages, i + 1);
                let index = memory.indexOf(pageToReplace);
                memory[index] = page;  // Replace the optimal page with the new one
            }
        }

        // Log the current state of memory
        console.log(`Page ${page} -> Memory: [${memory.join(", ")}]`);
    });

    // Return the total number of page faults
    return pageFaults;
}

// Helper function to get the optimal page to replace
function getOptimalPage(memory, pages, currentIndex) {
    let farthestIndex = -1;
    let pageToReplace = null;

    // Loop over each page in memory and find the one used farthest in the future
    memory.forEach(page => {
        let nextUseIndex = pages.slice(currentIndex).indexOf(page);

        // If the page will not be used again in the future, return it immediately
        if (nextUseIndex === -1) {
            pageToReplace = page;
            return;
        }

        // Update the farthest used page
        nextUseIndex += currentIndex;
        if (nextUseIndex > farthestIndex) {
            farthestIndex = nextUseIndex;
            pageToReplace = page;
        }
    });

    return pageToReplace;
}

// const pages = [1, 2, 3, 1, 4, 5]; //[7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1]
// const capacity = 3;
// const faults_fifo = fifoPageReplacement(pages, capacity);

// console.log(`\n\n\nTotal Page Faults: ${faults_fifo}`);


// Example usage:
// const pages = [7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1];
const pages = [0,1,2,0,1,3,0,1,2,3]
const capacity = 3;
const faults_fifo = fifoPageReplacement(pages, capacity);

console.log(`Total Page Faults: ${faults_fifo}`);

console.log('\n\n\n');


const faults_lru = lruPageReplacement(pages, capacity);
console.log(`Total Page Faults: ${faults_lru}`);

console.log('\n\n\n');


const faults_opt = optPageReplacement(pages, capacity);
console.log(`Total Page Faults: ${faults_opt}`);