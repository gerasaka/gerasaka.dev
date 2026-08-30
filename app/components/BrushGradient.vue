<template>
  <svg
    viewBox="0 0 1194 596"
    fill="none"
    role="presentation"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g class="brush-stroke">
      <ellipse
        cx="491.649"
        cy="83.5572"
        rx="491.649"
        ry="83.5572"
        transform="matrix(0.968801 -0.24784 0.509975 0.860189 165.553 451.69)"
        fill="url(#brush-paint0)"
        fill-opacity="0.25"
      />
    </g>
    <g class="brush-stroke">
      <ellipse
        cx="483.495"
        cy="139.173"
        rx="483.495"
        ry="139.173"
        transform="matrix(0.968801 -0.24784 0.509975 0.860189 -9.99996 343.178)"
        fill="url(#brush-paint1)"
        fill-opacity="0.25"
      />
    </g>
    <g class="brush-stroke">
      <ellipse
        cx="532.738"
        cy="107.968"
        rx="532.738"
        ry="107.968"
        transform="matrix(0.968801 -0.24784 0.509975 0.860189 -9.53073 291.067)"
        fill="url(#brush-paint2)"
        fill-opacity="0.25"
      />
    </g>
    <g class="brush-stroke">
      <ellipse
        cx="412.289"
        cy="83.5572"
        rx="412.289"
        ry="83.5572"
        transform="matrix(0.968801 -0.24784 0.509975 0.860189 77.5196 204.363)"
        fill="url(#brush-paint3)"
        fill-opacity="0.25"
      />
    </g>

    <defs>
      <radialGradient
        id="brush-paint0"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(491.649 83.5572) scale(491.649 83.5572)"
      >
        <stop stop-color="#4285D5" />
        <stop offset="1" stop-color="#709FD7" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        id="brush-paint1"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(483.495 139.173) scale(483.495 139.173)"
      >
        <stop stop-color="#4285D5" />
        <stop offset="1" stop-color="#709FD7" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        id="brush-paint2"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(532.738 107.968) scale(532.738 107.968)"
      >
        <stop stop-color="#4285D5" />
        <stop offset="1" stop-color="#709FD7" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        id="brush-paint3"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(412.289 83.5572) scale(412.289 83.5572)"
      >
        <stop stop-color="#4285D5" />
        <stop offset="1" stop-color="#709FD7" stop-opacity="0" />
      </radialGradient>
    </defs>
  </svg>
</template>

<style scoped>
  @reference "~/assets/styles/index.css";

  .brush-stroke {
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    animation: brush-in 1100ms var(--ease-elegant, cubic-bezier(0.23, 1, 0.32, 1)) forwards;
  }

  .brush-stroke:nth-of-type(1) {
    animation-delay: 0ms;
  }
  .brush-stroke:nth-of-type(2) {
    animation-delay: 140ms;
  }
  .brush-stroke:nth-of-type(3) {
    animation-delay: 280ms;
  }
  .brush-stroke:nth-of-type(4) {
    animation-delay: 420ms;
  }

  @keyframes brush-in {
    from {
      opacity: 0;
      transform: scale(0.8) translateX(48px);
      filter: blur(14px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateX(0);
      filter: blur(0);
    }
  }
</style>
