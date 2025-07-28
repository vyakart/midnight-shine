#!/usr/bin/env python3
"""
CLI splash screen for “Vyakart”.

This script prints an ASCII‑art representation of a stylised universe followed
by the word “Vyakart” and its equivalent in several languages.  The name
“Vyakart” comes from Sanskrit and can be interpreted as “creator” or
“one who brings forth”.  To keep things simple and portable the script only
relies on Python’s standard library.  It prints to a standard terminal and
uses basic ANSI escape codes for colour to make the splash screen feel a bit
more lively.  Feel free to run this file directly from your shell: it has
execute permissions and a shebang line at the top.

Translations sourced from the “In Different Languages” multilingual word
dictionary site were used for the languages supported by the site.  The
Sanskrit form “व्याकर्तृ” (vyākartṛ) meaning “creator” comes from the
Sanskrit dictionary entry for creator【431124209226485†L51-L59】【431124209226485†L155-L159】.  The
Chakma translation does not have a widely available authoritative source,
so the Bengali‑derived word “সৃষ্টিকর্তা” (sriṣṭikarta) – which also
conveys the idea of a creator – is used as a placeholder.

"""

import os
import sys
import time


def coloured(text: str, colour_code: str) -> str:
    """Wrap a string in an ANSI colour if the output is a TTY.

    Parameters
    ----------
    text : str
        The text to wrap.
    colour_code : str
        A number or code recognised by ANSI terminals.  For example
        '34' yields blue, '35' yields magenta, etc.

    Returns
    -------
    str
        A coloured version of the input text if stdout is a terminal,
        otherwise the unmodified text.
    """
    if sys.stdout.isatty():
        return f"\033[{colour_code}m{text}\033[0m"
    return text


def print_universe():
    """Render a simple universe scene using ASCII characters.

    The universe here is composed of dots, asterisks and other glyphs to
    suggest stars and nebulas.  Each line is printed with a small delay
    to create a loading effect.
    """
    universe_lines = [
        "                                 .           *       .               .",  # 1
        "                    .                     .             .          .",
        "        .                .       .              *             .        ",
        "              .       *       .       .                 .         *   ",
        "    .       .       .            .            .       .    .         ",
        "             .         .   .  *      .   .             *      .       ",
        "        *      .     .    .       .     .    .      .     .         ",
        "   .             .        .    .        *       .         .         ",
        "          .    .      .        .       .      .      .      .        ",
        "             .         .    *      .        .   .        .           ",
        "                 .       .        .   .      .        .       *      ",
        "       .    .        .        .       .         .     .      .       ",
    ]
    for line in universe_lines:
        print(coloured(line, '36'))  # cyan-ish colour for the stars
        time.sleep(0.05)


def print_translations():
    """Print the name 'Vyakart' alongside translations of 'creator' in
    various languages.

    Each language name is padded to align the columns neatly.  Colours are
    varied slightly for each language to add visual interest.
    """
    translations = [
        ("English", "Vyakart"),
        ("Kannada", "ಸೃಷ್ಟಿಕರ್ತ"),  # sṛṣṭikarta – creator【713132755522529†L30-L39】
        ("Chakma", "সৃষ্টিকর্তা"),  # placeholder using Bengali script
        ("Japanese", "クリエイター"),  # kurieitā – creator【626932631174121†L26-L39】
        ("Sanskrit", "व्याकर्तृ"),  # vyākartṛ – creator【431124209226485†L51-L59】【431124209226485†L155-L159】
        ("Arabic", "المنشئ"),    # al‑munshi – creator【167051655878296†L30-L38】
        ("Russian", "создатель"),  # sozdately – creator【189490483065446†L35-L39】
        ("Chinese", "创造者"),    # chuàngzào zhě – creator【543026591737537†L30-L39】
        ("Portuguese", "O Criador"),  # the creator【896392373315686†L30-L38】
        ("Yoruba", "Eleda"),     # creator【229768863961695†L30-L37】
    ]
    colours = ['32', '33', '34', '35', '36', '31', '32', '33', '34', '35']
    max_len = max(len(lang) for lang, _ in translations)
    print()  # blank line before translations
    for idx, (lang, word) in enumerate(translations):
        colour = colours[idx % len(colours)]
        padded_lang = lang.ljust(max_len)
        print(coloured(f"{padded_lang} : {word}", colour))


def main():
    """Entry point for the CLI.

    Prints the universe art, waits briefly, then prints the translations
    section.  A final newline is added to separate the splash from whatever
    might follow.
    """
    print_universe()
    # brief pause before showing the title
    time.sleep(0.2)
    print(coloured("\n=== VYAKART ===\n", '35'))  # magenta title
    print_translations()
    print()  # trailing blank line


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        # Handle Ctrl+C gracefully
        sys.exit(0)