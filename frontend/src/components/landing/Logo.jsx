export default function Logo({ className = "w-10 h-10" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 776 842"
      fill="none"
      className={className}
      role="img"
      aria-label="Project logo"
    >
      {/* Purple marks */}
      <path
        className="fill-secondary"
        d="M108 76
           C108 63 118 54 131 54
           H293
           C306 54 315 64 315 77
           V214
           C315 227 306 237 293 237
           H154
           V282
           H108
           Z"
      />

      <path
        className="fill-secondary"
        d="M28 328
           H235
           V386
           C235 405 220 420 201 420
           H62
           C43 420 28 405 28 386
           Z"
      />

      {/* Main flowing stroke */}
      <path
        className="stroke-base-content"
        strokeWidth="45"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M303 305
           H552
           C598 305 625 333 625 374
           V411
           C625 454 601 481 557 481
           H259
           C217 481 188 511 188 554
           V585
           C188 626 216 650 259 650
           H437"
      />

      {/* Cursor */}
      <path
        className="stroke-base-content"
        strokeWidth="45"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M537 558
           L691 604
           C708 609 713 626 699 639
           L655 653
           L642 705
           C638 721 620 727 610 713
           L537 578
           C531 567 532 561 537 558
           Z"
      />

      {/* Cursor cut-out follows the theme background */}
      <path
        className="fill-base-100"
        d="M555 582
           L670 616
           L635 627
           C629 629 625 633 624 639
           L615 678
           Z"
      />
    </svg>
  );
}
