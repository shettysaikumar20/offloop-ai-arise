#!/usr/bin/env bash
echo "=========================================================="
echo "⚔️  OFFLOOP AI: ARISE — Solo Leveling System Web Interface"
echo "    Your Real Life Is Your Dungeon."
echo "=========================================================="

cd "$(dirname "$0")/../frontend" || exit
npm run dev
