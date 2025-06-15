// /src/components/MatchSchedule.ts

/**
 * This module creates a list of scoreboard-style match blocks, styled for
 * the "Neon Arcade" theme. It is designed for dynamic updates from a WebSocket.
 */

// --- FIX: Simplified and corrected the data structures ---
// We only need one interface to define all the data for a single match.
export interface MatchData {
    id: number; // Unique ID for each match
    player1Name: string;
    player2Name:string;
    score1: number;
    score2: number;
}

// --- FIX: Added initial data for the component to render on load ---
// This was missing and would have caused a runtime error.
const initialScheduleData: MatchData[] = [
    { id: 1, player1Name: 'Aguardando', player2Name: 'Aguardando', score1: 0, score2: 0 }
];


// --- FIX: Heavily refactored this function to be correct and functional ---
function createMatchBlock(match: MatchData): HTMLElement {
    const block = document.createElement('div');
    block.className = 'flex justify-center items-center py-2 px-2';

    const scoreboardContainer = document.createElement('div');
    // FIX: Removed IDs from elements inside a loop to prevent invalid HTML (duplicate IDs).
    // We will target elements by their class or structure if needed.
    scoreboardContainer.className = 'scoreboard flex justify-around items-center w-full text-white';

    // --- Player 1 Side ---
    const player1Info = document.createElement('div');
    player1Info.className = 'flex flex-1 justify-end items-center gap-2';
  
    const player1NameElement = document.createElement('span');
    player1NameElement.className = 'text-sm font-semibold text-gray-300';
    // FIX: Using the actual data from the 'match' object passed into the function.
    player1NameElement.textContent = match.player1Name;
  
    const score1Element = document.createElement('span');
    score1Element.className = 'text-2xl font-bold font-mono text-neon-pink';
    // FIX: Using the actual score from the 'match' object.
    score1Element.textContent = match.score1.toString();
  
    player1Info.append(player1NameElement, score1Element); // Swapped order to match scoreboard style (Score | Name)
  
    // --- "VS" Separator ---
    const vsElement = document.createElement('span');
    vsElement.className = 'text-base font-semibold text-gray-400 mx-3';
    vsElement.textContent = 'VS';
  
    // --- Player 2 Side ---
    const player2Info = document.createElement('div');
    player2Info.className = 'flex flex-1 justify-start items-center gap-2'; // Removed flex-row-reverse for consistency
  
    const player2NameElement = document.createElement('span');
    player2NameElement.className = 'text-sm font-semibold text-gray-300';
    // FIX: Using the actual data from the 'match' object.
    player2NameElement.textContent = match.player2Name;
  
    const score2Element = document.createElement('span');
    score2Element.className = 'text-2xl font-bold font-mono text-neon-pink';
    // FIX: Using the actual score from the 'match' object.
    score2Element.textContent = match.score2.toString();
  
    player2Info.append(score2Element, player2NameElement);
    
    scoreboardContainer.append(player1Info, vsElement, player2Info);
    
    // --- CRITICAL FIX: The created scoreboard must be added to the main block ---
    block.appendChild(scoreboardContainer);
    
    // FIX: Removed the incorrect and unused 'TeamInfo' constant declaration.
    return block;
}

// --- DYNAMIC UPDATE FUNCTION ---
// FIX: Updated the function signature to use the new, correct MatchData type.
export function updateMatchSchedule(container: HTMLElement, matches: MatchData[]): void {
    container.innerHTML = ''; // Clear existing content

    matches.forEach((match, index) => {
        const matchBlock = createMatchBlock(match);
        container.appendChild(matchBlock);

        // Add a separator line between matches
        if (index < matches.length - 1) {
            const separator = document.createElement('div');
            separator.className = 'h-px bg-neon-green/30';
            container.appendChild(separator);
        }
    });
}

// --- MAIN EXPORTED FUNCTION ---
/**
 * Constructs the static shell of the match schedule component.
 * @returns {HTMLElement} The root element of the match schedule component.
 */
export function createMatchSchedule(): HTMLElement {
    const section = document.createElement('section');
    section.className = 'py-4';

    const container = document.createElement('div');
    container.className = 'container mx-auto';
    section.appendChild(container);

    const mainTitle = document.createElement('h2');
    mainTitle.className = 'text-xl font-bold mb-3 text-white text-center';
    mainTitle.textContent = 'PARTIDAS';
    container.appendChild(mainTitle);

    // The main "arcade box" container
    const arcadeContainer = document.createElement('div');
    arcadeContainer.className = 'arcade-container bg-black rounded-lg overflow-hidden border-2 border-neon-green w-full';

    // This div will hold the dynamic list of matches
    const matchListContainer = document.createElement('div');
    matchListContainer.id = 'match-list-container'; // ID for easy access
    arcadeContainer.appendChild(matchListContainer);

    container.appendChild(arcadeContainer);

    // Populate with initial data on creation
    updateMatchSchedule(matchListContainer, initialScheduleData);

    return section;
}