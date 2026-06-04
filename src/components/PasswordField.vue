<template>
  <div class="password-field">
    <label :for="id">{{ label }}</label>
    <div class="password-control">
      <input
        :id="id"
        :value="modelValue"
        :type="isVisible ? 'text' : 'password'"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :minlength="minlength"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        type="button"
        class="password-toggle"
        :aria-label="isVisible ? 'Hide password' : 'Show password'"
        :title="isVisible ? 'Hide password' : 'Show password'"
        @click="isVisible = !isVisible"
      >
        <svg v-if="!isVisible" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.1 12s3.7-6.5 9.9-6.5S21.9 12 21.9 12 18.2 18.5 12 18.5 2.1 12 2.1 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 3 18 18" />
          <path d="M10.6 5.7c.5-.1.9-.2 1.4-.2 6.2 0 9.9 6.5 9.9 6.5a18.2 18.2 0 0 1-3 3.7" />
          <path d="M6.6 6.8A18.7 18.7 0 0 0 2.1 12s3.7 6.5 9.9 6.5c1.8 0 3.4-.5 4.7-1.3" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  autocomplete: {
    type: String,
    default: 'current-password'
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Password'
  },
  minlength: {
    type: [Number, String],
    default: undefined
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const isVisible = ref(false)
</script>

<style scoped>
.password-field {
  display: grid;
  gap: 0.5rem;
}

.password-field label {
  color: #2c3e50;
  font-weight: 600;
}

.password-control {
  position: relative;
}

.password-control input {
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  padding: 0.75rem 3rem 0.75rem 0.75rem;
  transition: border-color 0.3s;
  width: 100%;
}

.password-control input:focus {
  border-color: var(--accent, #e74c3c);
  outline: none;
}

.password-toggle {
  align-items: center;
  background: transparent;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  height: 2rem;
  justify-content: center;
  position: absolute;
  right: 0.45rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
}

.password-toggle:hover {
  background: #f1f5f9;
  color: var(--accent, #e74c3c);
}

.password-toggle svg {
  fill: none;
  height: 1.25rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  width: 1.25rem;
}
</style>
