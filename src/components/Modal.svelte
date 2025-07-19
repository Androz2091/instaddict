<script>
    export let message;
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    function closeModal() {
        dispatch('close');
    }
    
    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }
</script>

<div class="modal-backdrop" on:click={handleBackdropClick}>
    <div class="modal-container">
        <button class="modal-close" on:click={closeModal} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <div class="modal-content">
            {@html message}
        </div>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
        animation: fadeIn 0.3s ease-out;
    }
    
    .modal-container {
        position: relative;
        background: var(--elevated-color, #1a1a1a);
        border: 1px solid var(--border-color, #333);
        border-radius: var(--border-radius-lg, 16px);
        box-shadow: var(--shadow-xl, 0 25px 50px -12px rgba(0, 0, 0, 0.5));
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow: hidden;
        animation: slideIn 0.3s ease-out;
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--surface-color, #2a2a2a);
        border: 1px solid var(--border-color, #333);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary, #888);
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 1;
    }
    
    .modal-close:hover {
        background: var(--main-color, #E1306C);
        color: white;
        transform: scale(1.1);
    }
    
    .modal-content {
        padding: 2rem;
        color: var(--text-primary, #fff);
        line-height: 1.6;
        font-size: 1.1rem;
    }
    
    .modal-content :global(a) {
        color: var(--main-color, #E1306C);
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s ease;
    }
    
    .modal-content :global(a:hover) {
        color: var(--secondary-color, #F56040);
        text-decoration: underline;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @media (max-width: 768px) {
        .modal-backdrop {
            padding: 0.5rem;
        }
        
        .modal-content {
            padding: 1.5rem;
            font-size: 1rem;
        }
        
        .modal-close {
            top: 0.75rem;
            right: 0.75rem;
            width: 36px;
            height: 36px;
        }
    }
</style>
