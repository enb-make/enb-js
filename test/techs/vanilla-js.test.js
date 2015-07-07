var EOL = require('os').EOL,
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    MockNode = require('mock-enb/lib/mock-node'),
    vanillaJs = require('../../techs/vanilla-js');

describe('vanilla-js', function () {
    var bundle,
        fileList,
        scheme;

    afterEach(function () {
        mock.restore();
    });

    it('must join files with comments', function () {
        scheme = {
            blocks: {
                'block1.vanilla.js': 'Hello1',
                'block2.vanilla.js': 'Hello2'
            },
            bundle: {}
        };

        mock(scheme);

        bundle = new MockNode('bundle');
        fileList = new FileList();

        fileList.loadFromDirSync('blocks');

        bundle.provideTechData('?.files', fileList);

        var reference = [
            '/* begin: ../blocks/block1.vanilla.js */',
            'Hello1',
            '/* end: ../blocks/block1.vanilla.js */',
            '/* begin: ../blocks/block2.vanilla.js */',
            'Hello2',
            '/* end: ../blocks/block2.vanilla.js */'
        ].join(EOL);

        return bundle.runTechAndGetContent(vanillaJs)
            .spread(function (content) {
                content.toString().must.be(reference);
            });
    });
});