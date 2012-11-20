#! /usr/bin/perl

if (open(LINES, $ARGV[0])) {
    @LINES = <LINES>;
    shift(@ARGV);
} else {
    @LINES = <STDIN>;
}

while ($var = shift(@ARGV)) {
    @OUT = ();
    $COUNT = 0;
    $value = shift(@ARGV);
    $STATE = 1;
    $NEXTSTATE = 1;
    foreach (@LINES) {
        if ($_ =~ m/IF-$var/) {
            if ($value) {
                $STATE = 0;
                $NEXTSTATE = 1;
            } else {
                $STATE = 0;
                $NEXTSTATE = 0;
            }
        } elsif ($_ =~ m/ELSE-$var/) {
            if ($value) {
                $STATE = 0;
                $NEXTSTATE = 0;
            } else {
                $STATE = 0;
                $NEXTSTATE = 1;
            }
        } elsif ($_ =~ m/FI-$var/) {
            $STATE = 0;
            $NEXTSTATE = 1;
        }
        if ($STATE) {
            $OUT[$COUNT++] = $_;

        }
        $STATE = $NEXTSTATE;
    }
    @LINES = @OUT;
}

print join("", @LINES);
