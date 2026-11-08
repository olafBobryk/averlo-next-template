# Folder: `src/components/ui/input/text`

This folder owns text, email, password, phone, multiline and hidden honeypot
entry. Implementations import `InputSkeleton` directly and keep private support
types out of the public facade.

## Structure

- Password visibility, strength and copy state are internal to `PasswordInput`.
- `phoneCountryOptions.ts` owns country normalization, filtering and dial-code
  matching; `PhoneCountryListbox.tsx` privately renders the country menu. Neither
  has a catalogue identity.
- Text-like controls keep `Field`, `InputFrame` and real input semantics.
- `PhoneInput` keeps display text, selected country and E.164 hidden form output
  as distinct state channels.
- `SpamProtectionFields` is a hidden honeypot, not a visible control.
