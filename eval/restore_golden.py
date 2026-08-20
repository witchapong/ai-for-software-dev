"""Put a gate's golden artifacts into a working copy.

Usage: python restore_golden.py <workdir> <gate-number> <golden-dir>

This is exactly what a stuck student does with `git checkout`, so running the
eval in assisted mode measures the recovery path they will actually take.
"""

import shutil
import sys
from pathlib import Path

BY_GATE = {
    1: ["requirements.md"],
    2: ["design.md", "tasks.md"],
    3: [],  # code, not an aidlc artifact - handled below
    4: [],
}

REPO = Path(__file__).resolve().parent.parent


def main() -> None:
    work, gate, golden = Path(sys.argv[1]), int(sys.argv[2]), Path(sys.argv[3])
    for name in BY_GATE.get(gate, []):
        source = golden / name
        if source.exists():
            shutil.copy(source, work / "aidlc" / name)
            print(f"    restored aidlc/{name}")
        else:
            print(f"    WARNING: no golden {name} yet - run Phase C first")
    if gate == 3:
        source = REPO / "template" / "core" / "spectrum.py"
        if source.exists():
            shutil.copy(source, work / "core" / "spectrum.py")
            print("    restored core/spectrum.py")


if __name__ == "__main__":
    main()
