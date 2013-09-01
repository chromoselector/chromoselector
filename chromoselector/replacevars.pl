#! /usr/bin/perl
open(VARS, 'vars.txt');
@VARS = <VARS>;
if (open(LINES, $ARGV[0])) {
    @LINES = <LINES>;
} else {
    @LINES = <STDIN>;
}
$INDEX = 0;
@INDEXES = split(//, "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ");
foreach (@VARS) {
    chomp($_);
    $count = 0;
    for ($i=0; $i<scalar(@LINES); $i++) {
        $LINES[$i] =~ s/\.$_/.$INDEXES[$INDEX]/g;
    }
    $INDEX++;
}
print join("", @LINES);
