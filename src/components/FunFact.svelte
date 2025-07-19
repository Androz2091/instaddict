<script>
    export let svg;
    export let strokeWidth = 2;
    export let strokeLinecap = 'round';
    export let strokeLinejoin = 'round';
    export let count = null;
    export let content = null;
    export let explanation = null;
    export let thirdColor = false;

    const htmlContent = content ?
        content.includes('%') ? content.split('%')[0] + '<span class="text-discord" class="'+(thirdColor && 'third-count')+'">' + (count !== null ? count.toLocaleString('en-US') : 'N/A') + '</span>' + content.split('%')[1] : content
        : null;
</script>

<div class="fun-fact-container scale-in">
    <div class="fun-fact">
        <div class="icon-wrapper">
            <slot name="icon">
                <svg class="{thirdColor ? 'third-svg' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap={strokeLinecap} stroke-linejoin={strokeLinejoin} stroke-width={strokeWidth} d="{ svg }"></path>
                </svg>
            </slot>
        </div>
        <div class="content-wrapper">
            <slot name="content">
                <h3 class="fact-content">{ @html htmlContent }</h3>
            </slot>
            <slot name="explanation">
                {#if explanation && !isNaN(count)}
                    <p class="fact-explanation">{ explanation }</p>
                {:else if !count && content}
                    <p class="fact-explanation unavailable">This data is not available...</p>
                {/if}
            </slot>
        </div>
    </div>
</div>

<style>
    .fun-fact-container {
        margin-bottom: 2rem;
    }
    
    .fun-fact {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
        padding: 2.25rem;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .fun-fact::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #E1306C, #F56040, #FCAF45);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }
    
    .fun-fact::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(135deg, #E1306C, #F56040);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .fun-fact:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 40px rgba(225, 48, 108, 0.2);
        border-color: rgba(225, 48, 108, 0.3);
    }
    
    .fun-fact:hover::before {
        opacity: 0.05;
    }
    
    .fun-fact:hover::after {
        opacity: 1;
    }
    
    .icon-wrapper {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.5rem;
        height: 4.5rem;
        background: linear-gradient(135deg, #E1306C, #F56040);
        border-radius: 16px;
        box-shadow: 0 8px 25px rgba(225, 48, 108, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    
    .icon-wrapper::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .fun-fact:hover .icon-wrapper {
        transform: scale(1.1) rotate(8deg);
        box-shadow: 0 12px 35px rgba(225, 48, 108, 0.4);
    }
    
    .fun-fact:hover .icon-wrapper::before {
        opacity: 1;
    }
    
    .icon-wrapper svg {
        width: 2rem;
        height: 2rem;
        color: white;
        stroke: currentColor;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        z-index: 1;
        position: relative;
    }
    
    .content-wrapper {
        flex: 1;
        min-width: 0;
    }
    
    .fact-content {
        margin: 0 0 1rem 0;
        font-size: 1.3rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.95);
        line-height: 1.5;
        letter-spacing: -0.01em;
    }
    
    .fact-content :global(.text-discord) {
        background: linear-gradient(45deg, #E1306C, #F56040);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        font-size: 1.3em;
        text-shadow: 0 2px 4px rgba(225, 48, 108, 0.2);
    }
    
    .fact-explanation {
        margin: 0;
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
        font-weight: 400;
    }
    
    .fact-explanation.unavailable {
        color: rgba(255, 255, 255, 0.5);
        font-style: italic;
    }
    
    .third-svg {
        color: #4CAF50 !important;
    }
    
    @media (max-width: 768px) {
        .fun-fact {
            padding: 2rem;
            gap: 1.25rem;
        }
        
        .icon-wrapper {
            width: 4rem;
            height: 4rem;
        }
        
        .icon-wrapper svg {
            width: 1.75rem;
            height: 1.75rem;
        }
        
        .fact-content {
            font-size: 1.2rem;
        }
        
        .fact-explanation {
            font-size: 0.95rem;
        }
    }
    
    @media (max-width: 480px) {
        .fun-fact {
            padding: 1.75rem;
            gap: 1rem;
        }
        
        .icon-wrapper {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 12px;
        }
        
        .icon-wrapper svg {
            width: 1.5rem;
            height: 1.5rem;
        }
        
        .fact-content {
            font-size: 1.1rem;
        }
        
        .fact-explanation {
            font-size: 0.9rem;
        }
    }
</style>
