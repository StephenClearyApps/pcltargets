import * as React from 'react';

function showAds() {
    window.setTimeout(() => {
        try {
            ((window as any).adsbygoogle || []).push({});
        } catch (e) {
            // adsbygoogle will throw if there are no ads to load.
        }
    }, 200);
}

const adSense = { __html: `<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2749292939902134"
     data-ad-slot="2306105825"
     data-ad-format="auto"></ins>` };

export class Ad extends React.Component<void, void> {
    componentDidMount() {
        showAds();
    }

    render() {
        return (
            <div style={{ textAlign: 'center', marginTop:20, marginBottom:20 }}>
                <div dangerouslySetInnerHTML={adSense}/>
            </div>
        );
    }
}
